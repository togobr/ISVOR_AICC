define([], function() {
	var convertTotalSeconds = function(ts) {
		var sec,
			tmp,
			strSec,
			strWholeSec,
			strFractionSec,
			rtnVal,
			hour,
			min;

		sec = (ts % 60);
		ts -= sec;
		tmp = (ts % 3600); //# of seconds in the total # of minutes
		ts -= tmp; //# of seconds in the total # of hours

		// convert seconds to conform to CMITimespan type (e.g. SS.00)
		sec = Math.round(sec * 100) / 100;

		strSec = new String(sec);
		strWholeSec = strSec;
		strFractionSec = "";

		if (strSec.indexOf(".") != -1) {
			strWholeSec = strSec.substring(0, strSec.indexOf("."));
			strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
		}

		if (strWholeSec.length < 2) {
			strWholeSec = "0" + strWholeSec;
		}
		strSec = strWholeSec;

		if (strFractionSec.length) {
			strSec = strSec + "." + strFractionSec;
		}

		if ((ts % 3600) != 0)
			hour = 0;
		else hour = (ts / 3600);
		if ((tmp % 60) != 0)
			min = 0;
		else min = (tmp / 60);

		if ((new String(hour)).length < 2)
			hour = "0" + hour;
		if ((new String(min)).length < 2)
			min = "0" + min;

		rtnVal = hour + ":" + min + ":" + strSec;

		return rtnVal;
	}

	return convertTotalSeconds;
});