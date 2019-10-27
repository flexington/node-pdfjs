class frontend {

    constructor(input, canvas) {
        this.PDFJS = window['pdfjs-dist/build/pdf'];
        this._input = input;
        this._canvas = canvas;

        this._input.addEventListener('change', (event) => { this.onInputChanged(event); });
    }

    onInputChanged(event) {
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.onload = () => {
            this.convert(fileReader.result);
        };
        fileReader.readAsArrayBuffer(file);
    }

    convert(file) {
        let loadingTask = this.PDFJS.getDocument({
            data: file,
            disableFontFace: false,
            cMapUrl: './cmaps',
            disableRange: true
        });
        loadingTask.promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
                let viewport = page.getViewport({ scale: 2 });

                let context = this._canvas.getContext('2d');
                this._canvas.height = viewport.height;
                this._canvas.width = viewport.width;

                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                let renderTask = page.render(renderContext);
            });
        });
    }

}