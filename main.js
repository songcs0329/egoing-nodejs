const http = require('http')
const url = require('url')
const sanitizeHtml = require('sanitize-html')

const template = require('./modules/template')
const fetch = require('./modules/fetch')

const resAction = (code, res, dom) => {
	res.writeHead(code)
	res.end(dom)
}

const app = http.createServer(async (request, response) => {
	const _url = request.url
	const queryData = url.parse(_url, true).query
	const pathname = url.parse(_url, true).pathname

	const filesList = await fetch.readDir()
	const list = template.list(filesList)
	let title = queryData.id
	let control = template.controller(pathname, title)
	let description = await fetch.readFile(queryData.id)
	title = sanitizeHtml(title)
	description = sanitizeHtml(description, {
		allowedTags: ['u', 'b', 'strong']
	})
	let body = template.body(pathname, title, description)

	if(pathname === "/") {
		if(queryData.id === undefined) {
			title = "Welcome"
			control = `<a href="/create">create</a>`
			description = "Hello Node.js"
			body = template.body(pathname, title, description)
		}
		const component = template.HTML(title, list, control, body)
		resAction(200, response, component)
	} else if(pathname === "/create") {
		title = "WEB - Create"
		const component = template.HTML(title, list, control, body)
		resAction(200, response, component)
	} else if(pathname === "/create_process") {
		fetch.createFile(request, response)
	} else if(pathname === "/update") {
		const component = template.HTML(title, list, control, body)
		resAction(200, response, component)
	} else if(pathname === "/update_process") {
		fetch.updateFile(request, response)
	} else if(pathname === "/delete_process") {
		fetch.deleteFile(request, response)
	} else {
		resAction(404, response, "Not Found")
	}
})
app.listen(3000);