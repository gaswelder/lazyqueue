module.exports = {
	entry: __dirname + "/src/index.js",
	output: {
		path: __dirname + "/../public",
		filename: "app.bin.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["react", "es2017"]
				}
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{ loader: "css-loader", options: { modules: true } }
				]
			}
		]
	}
};
