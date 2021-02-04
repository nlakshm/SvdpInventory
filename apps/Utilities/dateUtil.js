class Utilities {
  formatLocaleDateString(date) {
    let replaceLst = [",", "AM", "PM"];
    for (let i = 0; i < replaceLst.length; i++) {
      date = date.replace(replaceLst[i], "");
    }
    return date;
  }

  timeDiffCalc(dateFuture, dateNow) {
    rs = {};
    let diffInMilliSeconds =
      Math.abs(new Date(dateFuture) - new Date(dateNow)) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    rs["days"] = days;

    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    rs["hours"] = hours;

    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    rs["minutes"] = minutes;

    return rs;
  }
  //console.log(timeDiffCalc(new Date('2019/10/1 04:10:00 PM'), new Date('2019/10/2 18:20:00 AM')));
}

var dateUtil = new Utilities();
export default dateUtil;
