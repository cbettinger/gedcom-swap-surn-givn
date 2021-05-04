const fs = require("fs");
const path = require("path");

try {
	let gedcomFile = getFile();

	createBackup(gedcomFile.path);

	gedcomFile.content = swapInNAMELines(gedcomFile.content);
	gedcomFile.content = swapInSURNGIVNLines(gedcomFile.content);

	writeFile(gedcomFile);
}
catch (error) {
	console.error(error.message);
	process.exit(-1);
}

function getFile() {
	let content = null;

	let args = process.argv.slice(2);
	if (!args.length) {
		throw new Error("Missing argument FILE_SRC");
	}

	let path = args[0];
	if (!fs.existsSync(path)) {
		throw new Error(`File '${path}' does not exist`);
	}
	else {
		content = fs.readFileSync(path).toString();
	}

	return {
		path,
		content
	};
}

function createBackup(src) {
	fs.copyFileSync(src, `${Date.now()}_${src}.bak`, fs.constants.COPYFILE_EXCL);
}

function swapInNAMELines(content) {
	return content.replace(/1 NAME (.+) \/(.+)\//g, "1 NAME $2 /$1/");
}

function swapInSURNGIVNLines(content) {
	return content.replace(/2 SURN (.+)\r\n2 GIVN (.+)/g, "2 SURN $2\r\n2 GIVN $1");
}

function writeFile(file) {
	fs.writeFileSync(file.path, file.content);
}
