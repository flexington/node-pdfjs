class backend {
    constructor(input, canvas) {
        this._input = input;
        this._canvas = canvas;

        this._input.addEventListener('change', (event) => { this.onInputChange(event); });
    }

    onInputChange(event) {
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.onload = () => {
            this.convert(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }

    convert(file) {
        let data = { file: { mime: "application/pdf", data: file } };
        $.ajax({
            type: 'POST',
            url: 'http://localhost:61224/api',
            data: data
        })
            .done((response) => {

                let image = new Image();
                image.src = response.data.pages[0].image;
                image.onload = () => {
                    this._canvas.width = image.width;
                    this._canvas.height = image.height;
                    let context = this._canvas.getContext('2d');
                    context.drawImage(image, 0, 0, image.width, image.height);
                };

                console.log(response);
            });
    }

}