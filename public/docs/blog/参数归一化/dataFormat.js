// 可能调用的方式

// 格式化器归一化
function _formatNormalize(formatter) {
    if (typeof formatter === 'function') {
        return formatter;
    }
    if (typeof formatter !== 'string') {
        throw new Error('formatter must be a string or a function');
    }

    if (formatter === 'date') {
        formatter = 'yyyy-MM-dd';
    } else if (formatter === 'datetime') {
        formatter = 'yyyy-MM-dd HH:mm:ss';
    }
    return (dateInfo) => {
        const {yyyy,MM,dd,HH,mm,ss,SSS} = dateInfo
        return formatter
            .replace(/yyyy/g, yyyy)
            .replace(/MM/g, MM)
            .replace(/dd/g, dd)
            .replace(/HH/g, HH)
            .replace(/mm/g, mm)
            .replace(/ss/g, ss)
            .replace(/SSS/g, SSS);
    }
}

/**
 * 格式化日期
 * @param {Date} date - 日期
 * @param {string|function} formatter - 格式化器
 * @param {boolean} padding - 是否补零
 * @returns {string} - 格式化后的日期
 * */ 
function formate(date, formatter, padding = false) {
    formatter = _formatNormalize(formatter)
    function _pad(value,length) {
        if(padding) {
            return value.toString().padStart(length, '0')
        }else{
            return value.toString()
        }
    }
    const dateInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
    }
    dateInfo.yyyy = _pad(dateInfo.year, 4)
    dateInfo.MM = _pad(dateInfo.month, 2)
    dateInfo.dd = _pad(dateInfo.day, 2)
    dateInfo.HH = _pad(dateInfo.hour, 2)
    dateInfo.mm = _pad(dateInfo.minute, 2)
    dateInfo.ss = _pad(dateInfo.second, 2)
    dateInfo.SSS = _pad(dateInfo.millisecond, 3)
    
    return formatter(dateInfo)

}

// 2025-12-19
formate(new Date(), 'date')

// 2025-12-19  21:07:23
formate(new Date(), 'datetime')

// 2025-12-19 
format(new Date(), 'date', true)

// 2025-12-19 21:07:23
format(new Date(), 'datetime', true)

// 2025年12月19日 21:07:23:334
format(new Date(), 'yyyy年MM月dd日 HH:mm:ss:SSS', true)

// 2025年12月19日 21:07:23:334
format(new Date("20225/12/19"), (dateInfo) => {
    const { year } = dateInfo;
    const thisYear = new Date().getFullYear();
    if (year < thisYear) {
        return `${thisYear - year}年前`
    } else if (year > thisYear) {
        return `${year - thisYear}年后`
    } else {
        return `今年`
    }
})


