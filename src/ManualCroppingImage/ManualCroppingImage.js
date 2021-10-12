import React, {useState, useEffect} from "react";
import ReactLassoSelect, {getCanvas} from "react-lasso-select";



export function getClippedImageCanvas(src, path, callback, crop = true) {

    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.setAttribute('crossOrigin', '');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return callback(new Error('CTX is null'), canvas);
    }
    image.onerror = () => {
        callback(new Error('Failed to load image'), canvas);
    };
    image.onload = () => {
        try {
            canvas.width = image.naturalWidth + 2;
            canvas.height = image.naturalHeight + 2;
            ctx.drawImage(image, 0, 0);
            if (path.length < 3) {
                callback(null, canvas);
                return;
            }
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.lineTo(0, 0);
            ctx.lineTo(path[0].x + 1, path[0].y + 1);
            path.slice(1).forEach(({ x, y }) => ctx.lineTo(x + 1, y + 1));
            ctx.lineTo(path[0].x + 1, path[0].y + 1);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.clip('evenodd');
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill();
            if (crop) {
                const xAxis = path.map(({ x }) => x + 1);
                const yAxis = path.map(({ y }) => y + 1);
                const [minX, minY] = [Math.min.apply(null, xAxis), Math.min.apply(null, yAxis)];
                const [maxX, maxY] = [Math.max.apply(null, xAxis), Math.max.apply(null, yAxis)];
                const [width, height] = [maxX - minX, maxY - minY];
                const imageData = ctx.getImageData(minX, minY, width, height);
                canvas.width = width;
                canvas.height = height;
                ctx.putImageData(imageData, 0, 0);
            }
            callback(null, canvas);
        }
        catch (err) {
            callback(err, canvas);
        }
    };
    image.src = src;
}


function Manual_cropper({image}){
     useEffect(() => { setImage(image)},[image])

    const [src, setImage] = useState("./eu.jpg");
    const [clippedImg, setClippedImg] = useState(
        "data:image/gif;base32,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
    );
    const [width, setWidth] = useState(300);
    const [logs, setLogs] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const init = "172,173 509,99 458,263"
        .split(" ")
        .map((c) => c.split(",").map(Number))
        .map(([x, y]) => ({ x, y }));
    const [points, setPoints] = useState(init);


    return (
        <>
        <div className="pre">
            <ReactLassoSelect
                value={points}
                src={image}
                disabled={disabled}
                onChange={(path) => {
                    setPoints(path);
                }}
                onComplete={(path) => {
                    if (!path.length) return;
                    getClippedImageCanvas(src, path, (err, canvas) => {
                        if (!err) {
                            setClippedImg(canvas.toDataURL())


                        }
                        else(console.log(err))
                    });
                }}
                onImageError={() => setLogs([...logs, "image not loaded"])}
                onImageLoad={() => setLogs([...logs, "image loaded"])}
                imageStyle={{ width: `${width}px` }}
            />

        </div>

    <div>
        <img src={clippedImg}/>

    </div>
            </>


    );
}
export default Manual_cropper;
