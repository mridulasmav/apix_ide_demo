
let Swagger = require('swagger-client');
let apix = require("./apix.json");

exports.main = function () {

	Swagger.http({
		url: `https://services.${apix.domain}/api-sandbox/application/token`,
		method: 'post',
		query: {},
		headers: { "Accept": "*/*", "Content-Type": "application/json" },
		body: JSON.stringify({
			"userName": apix.credentials.username,
			"password": apix.credentials.password
		})
	}).then((response) => {
		// Call for Get Full Profile
		Swagger.http({
			url: 'https://hk-demo14-test.apigee.net/customerEnquiry/getFullProfile/S1350809G',
			method: 'get'
		}).then((response) => {
			console.log("====Swagger Response for Full Profile======", response.body);
			// Fetching session token for Data zoo
			Swagger.http({
				url: 'https://idu-test.datazoo.com/api/v2/auth/sign_in',
				method: 'post',
				headers: { "Accept": "*/*", "Content-Type": "application/json" },
				body: JSON.stringify({
					"userName": "APIGEE_Test",
					"password": "ASpLC4X*jq9+rK-Y",
				})
			}).then((response) => {
				console.log("========Session token for DataZoo=====")
				console.log(response.body.sessionToken);
				// Call for Data zoo verification url
				Swagger.http({
					url: 'https://idu-test.datazoo.com/api/v2/verify',
					method: 'post',
					headers: { "Accept": "*/*", "Content-Type": "application/json",	"Authorization": response.body.sessionToken },
					body: JSON.stringify({
						"countryCode": "SG",
						"service": [
							"Singapore Credit Bureau"
						],
						"fullName": "TEO CHO LIN",
						"gender": "Female",
						"dateOfBirth": "1959-03-09",
						"addressElement1": "55 HUME AVENUE 05-12",
						"addressElement2": "598752",
						"addressElement3": "SINGAPORE",
						"addressElement4": "Singapore",
						"consentObtained": {
							"Singapore Credit Bureau": true
						},
						"identityVariables": {
							"nationalIDNo": "S1350809G"
						}
					})
				}).then((response) => {
					console.log("======Datazoo Verification Response=========")
					console.log(response.data)
				}).catch((err) => {
					console.log(err);
				})
			}).catch((err) => {
				console.log(err);
			})
		}).catch((err) => {
			console.log(err);
		})
	}).catch((err) => {
		console.error(err);
	});
}

this.main();