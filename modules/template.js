module.exports = {
	HTML: (title, list, control, body) => {
		return `
			<!doctype html>
			<html>
			<head>
				<title>WEB - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">WEB</a></h1>
				${list}
				${control}
				${body}
			</body>
			</html>
		`
	},
	list: list => {
		const reducer = list.reduce((acc, cur) => acc += `<li><a href="/?id=${cur}">${cur}</a></li>`, "")
		return `<ul>
			${reducer}
		</ul>`
	},
	body: (path, title, desc) => {
		if(path === "/create") {
			return `
				<form action="/create_process" method="post">
					<p><input type="text" name="title" placeholder="title"></p>
					<p><textarea name="description" placeholder="description"></textarea></p>
					<p><input type="submit" placeholder="submit"></p>
				</form>
			`
		} else if(path === "/update") {
			return `
				<form action="/update_process" method="post">
					<input type="hidden" name="id" value=${title} />
					<p><input type="text" name="title" placeholder="title" value=${title}></p>
					<p><textarea name="description" placeholder="description">${desc}</textarea></p>
					<p><input type="submit" placeholder="submit"></p>
				</form>
			`
		}
		else return `<h2>${title}</h2>${desc}`
	},
	controller: (path, title) => {
		if(path === "/") {
			return `
				<a href="/create">create</a>
				<a href="/update?id=${title}">update</a>
				<form action="/delete_process" method="post">
					<input type="hidden" name="id" value="${title}" />
					<input type="submit" value="delete" />
				</form>
			`
		}
		else if(path === "/create") return ""
		else if(path === "/update") return `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
	},
}