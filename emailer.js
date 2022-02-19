import { SMTPClient, Message } from 'emailjs';

const client = new SMTPClient({
	user: 'user',
	password: 'password',
	host: 'smtp-mail.outlook.com',
	tls: {
		ciphers: 'SSLv3',
	},
});

const message = new Message({
	text: 'i hope this works',
	from: 'you <username@outlook.com>',
	to: 'someone <someone@your-email.com>, another <another@your-email.com>',
	cc: 'else <else@your-email.com>',
	subject: 'testing emailjs',
	attachment: [
		{ data: '<html>i <i>hope</i> this works!</html>', alternative: true },
		{ path: 'path/to/file.zip', type: 'application/zip', name: 'renamed.zip' },
	],
});

// send the message and get a callback with an error or details of the message that was sent
client.send(message, (err, message) => {
	console.log(err || message);
});
