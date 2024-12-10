import axios from 'axios';
import dayjs from 'dayjs';
import { formatNumber } from './';

export async function apiGetMonitors (config) {
  const apikey = config.apiKey;
  if (!apikey) throw '请在 app.config.js 中配置 API Key';
  const days = config.days;

  const dates = [];
  const today = dayjs(new Date().setHours(0, 0, 0, 0));
  for (let d = 0; d < days; d++) {
    dates.unshift(today.subtract(d, 'day'));
  }

  const ranges = dates.map((date) => `${date.unix()}_${date.add(1, 'day').subtract(1, 'second').unix()}`);
  const start = dates[0].hour(0).minute(0).second(0).millisecond(0).unix();
  const end = dates[dates.length - 1].hour(23).minute(59).second(59).millisecond(999).unix();
  ranges.push(`${start}_${end}`);

  const postdata = {
    api_key: apikey,
    monitors: config.monitors && config.monitors.length > 0 ? config.monitors.join('-') : null,
    format: 'json',
    logs: 1,
    logs_start_date: start,
    logs_end_date: end,
    custom_uptime_ranges: ranges.join('-'),
    response_times: 1,
  };

  const response = await axios.post(config.proxyUrl + '/getMonitors',
    JSON.parse(JSON.stringify(postdata, (key, value) => {
      return (value === null || value === undefined) ? undefined : value;
    })),
    { timeout: 8000 }
  );
  if (response.data.stat !== 'ok') throw response.data.error;
  var up = 0;
  var down = 0;
  var paused = 0;

  const monitors = response.data.monitors.map((monitor) => {

    const ranges = monitor.custom_uptime_ranges.split('-');
    const average = formatNumber(ranges.pop());
    const daily = [];
    const map = [];
    const response = [];
    const logs = [];

    switch (monitor.status) {
      case 2:
        up++
        break;
      case 8:
      case 9:
        down++
        break;
      case 0:
      case 1:
        paused++
        break;
      default:
        break;
    }

    dates.forEach((date, index) => {
      map[date.format('YYYYMMDD')] = index;
      daily[index] = {
        date: date,
        uptime: formatNumber(ranges[index]),
        down: { times: 0, duration: 0 },
      }
    });

    const total = monitor.logs.reduce((total, log) => {

      logs.push({
        type: log.type === 1 ? 'danger' : log.type === 2 ? 'success' : log.type === 98 ? 'primary' : log.type === 99 ? 'info' : 'info',
        time: dayjs.unix(log.datetime).format('YYYY-MM-DD HH:mm:ss'),
        reason: log.reason,
        duration: log.duration
      });

      if (log.type === 1) {
        const now = dayjs.unix(log.datetime);
        const date = now.format('YYYYMMDD');
        total.duration += log.duration;
        total.times += 1;

        if (log.duration > now.add(1, 'day').startOf('day').unix() - now.unix() > 0) {
          let remainingDuration = log.duration;
          let currentDate = now;

          while (remainingDuration > 0) {
            const tomorrow = currentDate.add(1, 'day').startOf('day');
            const currentFormat = currentDate.format('YYYYMMDD');
            const diffInSeconds = tomorrow.unix() - currentDate.unix();

            if (remainingDuration >= diffInSeconds) {
              daily[map[currentFormat]].down.duration += diffInSeconds;
              remainingDuration -= diffInSeconds;
              currentDate = tomorrow;
            } else {
              daily[map[currentFormat]].down.duration += remainingDuration;
              remainingDuration = 0;
            }
            daily[map[currentFormat]].down.times += 1;
          }
        } else {
          daily[map[date]].down.duration += log.duration;
          daily[map[date]].down.times += 1;
        }
      }
      return total;
    }, { times: 0, duration: 0 });
    
    monitor.response_times?.map((item) => {
      response.unshift({
        time: dayjs.unix(item.datetime).format('MM-DD HH:mm'),
        value: item.value,
      })
    });

    const result = {
      id: monitor.id,
      name: monitor.friendly_name,
      url: monitor.url,
      average: average,
      daily: daily,
      total: total,
      response: response,
      logs: logs,
      status: 'unknow',
    };

    if (monitor.status === 2) result.status = 'ok';
    if (monitor.status === 9) result.status = 'down';
    return result;
  });

  return {
    up: up,
    down: down,
    paused: paused,
    status: down === 0 && up > 0 ? 1 : down > 0 && up > 0 ? 2 : down > 0 && up === 0 ? 3 : 0,
    monitors: monitors,
  };
}