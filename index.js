const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('async-file');
const uuidv4 = require('uuid/v4');
var uuid = uuidv4();


console.log('Regist Akun Gojek -> Redeem GOFOODNASGOR07\n');
const phoneNumber = readlineSync.question('Masukan No Hp: ');

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const functionGenName = () => new Promise((resolve, reject) => {
	fetch('https://fakenametool.net/random-name-generator/random/id_ID/indonesia/1', {
		method: 'GET'
	})
	.then(res => res.text())
	.then(result => {
		const $ = cheerio.load(result);
		const resText = $('div[class=col-lg-10] span').text();
		resolve(resText);
	})
	.catch(err => {
		reject(err)
	})
});



const functionDaftarGojek = (email, name, uuid, uniqid) => new Promise((resolve, reject) => {
	const url = 'https://api.gojekapi.com/v5/customers';

	const boday = {
		"email":email,
		"name":name,
		"phone": `+${phoneNumber}`,
		"signed_up_country":"ID"
	};

	fetch (url, {
		method : 'POST',
		headers : {
			'X-Session-ID': uuid,
			'X-Platform': 'Android',
			'X-UniqueId': uniqid,
			'X-AppVersion': '3.34.1',
			'X-AppId': 'com.gojek.app',
			'Accept': 'application/json',
			// 'D1': '03:25:1E:AE:CD:AF:35:FE:18:3C:15:B4:1F:94:6C:C2:0E:54:3D:84:3A:49:89:59:D9:90:EB:62:B8:AC:26:9C',
			'X-PhoneModel': 'Android,Custom',
			'X-PushTokenType': 'FCM',
			'X-DeviceOS': 'Android,6.0', 
			'Authorization': 'Bearer',
			'Accept-Language': 'en-ID',
			'X-User-Locale': 'en_ID',
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'okhttp/3.12.1'
		},
		body: JSON.stringify(boday)
	})
	.then(res => res.json())
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		resolve(err)
	})
});


const functionInputOtp = (otp, otpToken, uuid, uniqid) => new Promise((resolve, reject) => {
	const url = 'https://api.gojekapi.com/v5/customers/phone/verify';

	const boday = {
		"client_name":"gojek:cons:android",
		"client_secret":"83415d06-ec4e-11e6-a41b-6c40088ab51e",
		"data":
		{
			"otp": otp,
			"otp_token":otpToken
		}
	};

	fetch (url, {
		method : 'POST',
		headers : {
			'X-Session-ID': uuid,
			'X-Platform': 'Android',
			'X-UniqueId': uniqid,
			'X-AppVersion': '3.34.1',
			'X-AppId': 'com.gojek.app',
			'Accept': 'application/json',
			// 'D1': '03:25:1E:AE:CD:AF:35:FE:18:3C:15:B4:1F:94:6C:C2:0E:54:3D:84:3A:49:89:59:D9:90:EB:62:B8:AC:26:9C',
			'X-PhoneModel': 'Android,Custom',
			'X-PushTokenType': 'FCM',
			'X-DeviceOS': 'Android,6.0', 
			'Authorization': 'Bearer',
			'Accept-Language': 'en-ID',
			'X-User-Locale': 'en_ID',
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'okhttp/3.12.1'
		},
		body: JSON.stringify(boday)
	})
	.then(res => res.json())
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		reject(err)
	})
});

const functionRedeem = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
	const url = 'https://api.gojekapi.com/go-promotions/v1/promotions/enrollments';

	const boday = {
		"promo_code":"GOFOODNASGOR07"
};

	fetch (url, {
		method : 'POST',
		headers : {
			'X-Session-ID': uuid,
			'X-Platform': 'Android',
			'X-UniqueId': uniqid,
			'X-AppVersion': '3.34.1',
			'X-AppId': 'com.gojek.app',
			'Accept': 'application/json',
			// 'D1': '03:25:1E:AE:CD:AF:35:FE:18:3C:15:B4:1F:94:6C:C2:0E:54:3D:84:3A:49:89:59:D9:90:EB:62:B8:AC:26:9C',
			'X-PhoneModel': 'Android,Custom',
			'X-PushTokenType': 'FCM',
			'X-DeviceOS': 'Android,6.0',
			// 'User-uuid': accountId, 
			'Authorization': `Bearer ${accessToken}`,
			'Accept-Language': 'en-ID',
			'X-User-Locale': 'en_ID',
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'okhttp/3.12.1'
		},
		body: JSON.stringify(boday)
	})
	.then(res => res.json())
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		reject(err)
	})
});

(async () => { 
	try {
		const uniqueid = genUniqueId(16);
		const name = await functionGenName();
        const mail = await genUniqueId(7);
        const email = `${mail}@gmail.com`;
        const daftar = await functionDaftarGojek(email, name, uuid, uniqueid);
        if (daftar.success == false){
        	console.log(daftar)
        }
        const otpToken = daftar.data.otp_token;
        const otp = await readlineSync.question('Masukan Otp: ');
        const sendOtp = await functionInputOtp(otp, otpToken, uuid, uniqueid);
        if (!sendOtp.data.access_token) {
            console.log(sendOtp)
        }
        const accessToken =	 await  sendOtp.data.access_token;
        const saveToken = await fs.appendFile('token.txt',`${accessToken}\n`, function (err) {
            if (err) throw err;
            console.log('Gagal Menyimpan Acces Token!');
        });
        const redeem = await functionRedeem(accessToken, uuid, uniqueid);
        if (!redeem.data.message) {
        	console.log(redeem)
        }
        const pesan = await redeem.data.message;
        console.log(`[ ${moment().format('HH:mm:ss')} ] `+pesan);
	} catch (e) {
		console.log(e)
	}
})();