const isDevelopment = () => {
	return process?.env?.NODE_ENV?.toLocaleLowerCase() !== 'production';
}

const isProduction = () => {
	return process?.env?.NODE_ENV?.toLocaleLowerCase() === 'production';
}


module.exports = {
	isDevelopment,
	isProduction
}