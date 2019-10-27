import * as express from 'express';
import { urlencoded, json, text } from 'body-parser'
import * as http from 'http';
import * as cors from 'cors';
import * as path from 'path';
import PDFJS = require('pdfjs-dist');
import NodeCanvasFactory from './NodeCanvasFactory';
import { EventEmitter } from 'events';

export default class Server {
    private _app: express.Express;
    private _router: express.Router;
    private _server: http.Server;

    // Event to inform API that PDF Page rendering has been completed
    private _e: EventEmitter;

    constructor() {
        this._e = new EventEmitter();

        this._app = express();
        this._app.use(urlencoded({ limit: '10mb', extended: true }));
        this._app.use(json({ limit: '10mb', type: 'application/json' }));
        this._app.use(text())
        this._app.use(cors());

        this._router = express.Router();
        this._app.use('/', this._router);
        this._app.use(express.static(path.join(__dirname, 'static')));

        this._router.get('/', (req: express.Request, res: express.Response) => { res.json({ message: 'Works' }); });
        this._app.get('/frontend', (req: express.Request, res: express.Response) => { this.frontend(req, res); });
        this._app.get('/backend', (req: express.Request, res: express.Response) => { this.backend(req, res); });
        this._app.post('/api', (req: express.Request, res: express.Response) => { this.api(req, res); });

        this._server = this._app.listen(61224, 'localhost', () => { console.log('Server started on http://localhost:61224'); });
    }

    private frontend(req: express.Request, res: express.Response) {
        res.sendFile(path.join(`${__dirname}/static/frontend.html`));
    }

    private backend(req: express.Request, res: express.Response) {
        res.sendFile(path.join(`${__dirname}/static/backend.html`));
    }

    private api(req: express.Request, res: express.Response) {
        let expression = /^(data:[\w\/\+]+);([\w-]+|base64),/i;
        if (req.body.file.data.match(expression)) {
            req.body.file.data = (req.body.file.data as string).replace(expression, '');
        }

        let data = Buffer.from(req.body.file.data, 'base64').buffer;
        this.convertToImage(data);

        this._e.once('Success', (image: string) => {
            res
                .status(200)
                .json({ status: 200, data: { pages: [{ image: image }] } })
                .send();
        });

        this._e.once('Error', (error: string) => {
            res
                .status(500)
                .json({ status: 500, message: error })
                .send();
        });
    }

    public convertToImage(data: ArrayBuffer): void {
        if (data === undefined || data === null) throw new Error('No data provided');

        let root = path.dirname(require.main.filename || process.mainModule.filename);
        let loadingTask = PDFJS.getDocument({
            data: data,
            disableFontFace: false,
            cMapUrl: `${root}\\..\\node_modules\\pdfjs-dist\\cmaps\\`,
            cMapPacked: true,
            disableRange: true,
        });
        loadingTask.promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
                let viewport = page.getViewport({ scale: 2 });
                let canvasFactory = new NodeCanvasFactory();
                let canvasAndContext = canvasFactory.create(viewport.height, viewport.width);

                let renderContext = {
                    canvasContext: canvasAndContext.context,
                    viewport: viewport,
                    canvasFactory: canvasFactory
                }
                let renderTask = page.render(renderContext);
                renderTask.promise.then(() => {
                    this._e.emit('Success', canvasAndContext.canvas.toDataURL());
                }, (reason) => {
                    console.log(`RT: ${reason}`);
                    this._e.emit('Error', reason);
                });
            }, (reason) => {
                console.log(`GP: ${reason}`);
                this._e.emit('Error', reason);
            });
        },
            (reason) => {
                console.log(`LT: ${reason}`);
                this._e.emit('Error', reason);
            });
    }
}