const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // installed via npm
const CopyPlugin = require("copy-webpack-plugin");
const { BaseHrefWebpackPlugin } = require("base-href-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// ----
const APP_DIR = path.resolve(__dirname, "src");
const DEV_DIR = path.resolve(__dirname, "public");
const BUILD_DIR = path.resolve(__dirname, "dist");
const dev = process.env.NODE_ENV === "development";
const publicPath = dev ? "http://localhost:8080/" : "https://spizz.herokuapp.com/";
const MiniCss = {
	loader: ExtractCssChunks.loader,
	options: { hmr: dev },
};
const loadersCss = [
	{
		loader: "css-loader",
		options: {
			importLoaders: 1,
			modules: {
				exportLocalsConvention: "camelCaseOnly",
				localIdentName: "[local]",
			},
		},
	},
	{
		loader: "postcss-loader",
		options: { plugins: () => [require("autoprefixer/lib/autoprefixer")()] },
	},
];
const dts = {
	loader: "dts-css-modules-loader",
	options: {
		namedExport: true,
		banner: "// This file is generated automatically \n",
	},
};
const loadersScss = [MiniCss, dts, loadersCss[0], loadersCss[1], "sass-loader"];
const babelLoader = {
	loader: "babel-loader",
	options: {
		cacheDirectory: true,
		babelrc: true,
		extends: path.resolve(__dirname, ".babelrc"),
	},
};
const Config = {
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".scss"],
		alias: {
			"react-dom": "@hot-loader/react-dom",
			react: path.resolve(__dirname, "node_modules/react"),
			src: path.resolve(__dirname, "src"),
		},
	},
	entry: { main: ["@babel/polyfill", "react-hot-loader/patch", `${APP_DIR}/index.tsx`] },
	devServer: {
		contentBase: DEV_DIR,
		publicPath,
		historyApiFallback: true,
		hot: true,
		host: "localhost",
		stats: "minimal",
		port: 8080,
	},
	devtool: dev ? "eval-cheap-module-source-map" : "none",
	output: {
		filename: "[name].js",
		path: dev ? DEV_DIR : BUILD_DIR,
		publicPath,
		pathinfo: false,
		chunkFilename: "chunks/[id].chunk.js",
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				exclude: /node_modules/,
				use: babelLoader,
			},
			{
				test: /\.scss$/,
				use: loadersScss,
			},
			{
				test: /\.(png|jpe?g|gif|eot|woff|woff2|ttf)$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 5000,
					},
				},
			},
		],
	},
	plugins: [
		new ExtractCssChunks({
			filename: "[name].css",
			chunkFilename: "chunks/[id].ssc.css",
		}),
		new HtmlWebPackPlugin({
			template: path.resolve(__dirname, "public/index.html"),
			filename: "index.html",
		}),
		new BaseHrefWebpackPlugin({ baseHref: "/" }),
		new webpack.HotModuleReplacementPlugin(),
	],
	mode: !dev ? "production" : "development",
	output: {
		filename: "[name].js",
		path: dev ? DEV_DIR : BUILD_DIR,
		publicPath,
		pathinfo: false,
	},
	target: "web",
	optimization: {},
};

if (!dev) {
	Config.plugins.splice(
		1,
		0,
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require("cssnano"),
			cssProcessorPluginOptions: {
				preset: ["default", { discardComments: { removeAll: true } }],
			},
			canPrint: true,
		})
	);
	Config.plugins.splice(3, 0, new CleanWebpackPlugin());
	Config.plugins.splice(7, 0, new CopyPlugin({ patterns: [{ from: "public/assets", to: "assets" }] }));
}

module.exports = Config;
