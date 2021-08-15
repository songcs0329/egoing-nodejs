const fs = require('fs')
const qs = require('querystring')
const path = require('path')

module.exports = {
	readDir: async () => {
		try {
			return await fs.promises.readdir(`data/`)
		} catch (err) {
			console.log(err)
		}
	},
	readFile: async id => {
		if(!id) return ""
		const filterPathID = path.parse(id).base
		try {
			return await fs.promises.readFile(`data/${filterPathID}`, 'utf8')
		} catch(err) {
			console.log(err)
		}
	},
	createFile: (req, res) => {
		let body = ''
		req.on('data', data => { body += data })
		req.on('end', () => {
			const { title, description } = qs.parse(body)
			fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
				if(err) console.log(err)
				console.log('created!')
				res.writeHead(302, { Location: `/?id=${title}` })
				res.end()
			})
		})
	},
	updateFile: (req, res) => {
		let body = ''
		req.on('data', data => { body += data })
		req.on('end', () => {
			const { id, title, description } = qs.parse(body)
			console.log(path.parse(id));
			fs.rename(`data/${id}`, `data/${title}`, (err) => {
				if(err) console.log(err)
				console.log('updated!')
				fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
					if(err) console.log(err)
					res.writeHead(302, { Location: `/?id=${title}` })
					res.end()
				})
			})
		})
	},
	deleteFile: (req, res) => {
		let body = ''
		req.on('data', data => { body += data })
		req.on('end', () => {
			const { id } = qs.parse(body)
			const filterPathID = path.parse(id).base
			fs.unlink(`data/${filterPathID}`, (err) => {
				if(err) console.log(err)
				console.log('delete');
				res.writeHead(302, { Location: "/" })
				res.end()
			})
		})
	}
}