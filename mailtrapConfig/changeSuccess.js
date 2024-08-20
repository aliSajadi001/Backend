const { client, sender } = require("./mailtrap")

let changeSuccess = async(email)=>{
	let recipients  = [{email}]
	try {
     let res = await client.send({
			from : sender,
			to:recipients ,
			template_uuid: "8e086ae7-31f4-451d-9cf7-b0dd7374178f",
			template_variables: {
			}
		 })
	} catch (error) {
console.log(error)
	}
}

module.exports=changeSuccess