import {Card, Col, Row, Carousel} from "react-bootstrap";

const Tooltip = () => (


<Carousel style={{ width: '500px', height:'350px', marginBottom: '15px', marginLeft: '200px'}}>
    <Carousel.Item>
        <img
            className="d-block w-100"
            src="https://e360.yale.edu/assets/site/GettyImages-1187516526_australia-fires_web2.jpg"
            alt="First slide"
        />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </Card.Text>
        </Card.Body>
    </Carousel.Item>
    <Carousel.Item>
        <img
            className="d-block w-100"
            src="https://ichef.bbci.co.uk/news/640/cpsprodpb/4272/production/_115301071_gettyimages-1229485853.jpg"
            alt="Second slide"
        />

        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </Card.Text>
        </Card.Body>
    </Carousel.Item>
    <Carousel.Item>
        <img
            className="d-block w-100"
            src="https://observatoriodocinema.uol.com.br/wp-content/uploads/2020/07/michael-jackson-obs.jpg"
            alt="Third slide"
        />


        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </Card.Text>
        </Card.Body>
    </Carousel.Item>
</Carousel>

);


export default Tooltip;

