// // COMPONENTS //
// import { EmailTemplate } from "@/components/email/EmailTemplate.jsx";
// import { NextResponse } from "next/server";

// // OTHERS //
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// /** handler GET Request */
// export async function GET(request, response) {
// 	try {
// 		// const { name, email } = JSON.parse(request.body);
// 		const name = "developer name";
// 		const email = "developer email";

// 		const data = await resend.emails.send({
// 			from: "Emailer Studio <onboarding@resend.dev>",
// 			to: "developer@emailer-studio.internal",
// 			subject: "New submission to your contact form!",
// 			// html: "<h1>hello</h1>",
// 			react: EmailTemplate({ name, email }),
// 		});

// 		return new NextResponse.json(data, {
// 			status: 200,
// 		});
// 	} catch (error) {
// 		return new NextResponse.json(error, {
// 			status: 400,
// 		});
// 	}
// }
