// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let url = '';

let appName = 'live';
let s3ServerName = '';

switch (appName) {
  case 'localHost':
    url = 'http://192.168.0.129:8082/tape';
    break;
  // esimtesting.technojacks.com
  // 161.97.151.243:8097
  case 'live':
    if (location.protocol == 'https:') {
      url = 'https://esimtesting.technojacks.com';
    } else {
      url = 'http://esimtesting.technojacks.com';
      // url = 'http://192.168.0.213:8097';
    }
    // url = "http://esim.technojacks.com";
    //url = 'http://192.168.0.123:8099';
    break;
  case 'testing':
    url = 'http://testing.apmkingstrack.com:8082/tape/';
    s3ServerName = 'https://kingstrackimages.s3.ap-southeast-1.amazonaws.com';
    break;
  case 'liveSmart':
    url = 'https://smartvaahan.in/tape';
    s3ServerName = 'https://smartvaahan.s3.ap-south-1.amazonaws.com';
    break;
}
export const ServerUrl = {
  live: url,
  s3ServerName: s3ServerName,
};
export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
