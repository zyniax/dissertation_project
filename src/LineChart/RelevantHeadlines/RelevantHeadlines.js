import {Card, Col, Row, ListGroup} from "react-bootstrap";
import React from "react";
import './RelevantHeadlines.css'

var dataset1 = [
    {id: 1, title: 'Where Port Reigns, Unfortified Wines Undergo a Stylistic Evolution', publication_date: '2014-02-03', subtitle: 'The Douro Valley in Portugal seems an unlikely source for bottles with delicacy and subtlety, but producers are now creating elegant reds and whites.', web_url: 'https://www.nytimes.com/2019/07/25/dining/drinks/douro-valley-still-wines.html', main_image: "https://images.squarespace-cdn.com/content/v1/58d34f8859cc687828ac898b/1573744657822-ZBPTF4JYY3HFBSR1TR4R/ke17ZwdGBToddI8pDm48kFJh-pNMbEWuIua_4t_HF8VZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxIZIr-ZEpQ2ki8KDAfgr7FF79vNyAExzgeOSUgMOBd1jA6L5AngCnVNXXj7tmtOW4/1b79d79f45e363bccfe518284711414c.jpg?format=750w", value: 10000, Keywords: "Cristiano Ronaldo, Real Madrid, Laliga, Goals", Topics: "Football, Atletism, Sports"},
    {id: 2, title: 'Portuguese Join Europe’s Chorus of Discontent', publication_date: '2013-11-28', subtitle: 'Protests and work stoppages have become much more common, as daily life for many Portuguese families has become a struggle to stay afloat....', web_url: 'https://www.nytimes.com/2012/11/28/world/europe/portuguese-join-europes-chorus-of-discontent.html', main_image: "https://veja.abril.com.br/wp-content/uploads/2021/07/GettyImages-1325118902.jpg", value: 8000},
    {id: 3, title: 'Portugal’s Cristiano Ronaldo Can’t Mask Frustration in Tie With Austria', publication_date: '2016-06-19', subtitle: 'A steady stream of unclaimed opportunities made a 0-0 draw against Austria an exercise in frustration for Portugal’s Cristiano Ronaldo....', web_url: 'https://www.nytimes.com/2016/06/19/sports/soccer/portugals-ronaldo-cant-mask-frustration-during-tie-with-austria.html', main_image: "https://images.squarespace-cdn.com/content/v1/57aa5b0e9f7456bea43ce25a/1508860145904-53YCC7RRVIP6G7G0VVTI/10_Vinhos_Jancis_Robinson_DT.jpg", value: 900},
    {id: 4, title: 'Ronaldo Dethrones Messi as World Player of Year', publication_date: '2016-01-14', subtitle: 'Cristiano Ronaldo, who scored 66 goals in 56 games last year, did not win a team trophy, but he did lead his national team to a place in the World Cup....', web_url: 'https://www.nytimes.com/2014/01/14/sports/soccer/ronaldo-dethrones-messi-as-world-player-of-year.html', main_image: "https://www.collinsdictionary.com/images/full/galaxy_364586081.jpg", value: 5700},
    {id: 5, title: 'Telling the Story of 41 Years on the Run', publication_date: '2017-10-29', subtitle: 'Captured in Portugal last month, George Wright recounts his odyssey since he escaped from prison and hijacked a plane....', web_url: 'https://www.nytimes.com/2011/10/29/nyregion/george-wright-tells-story-of-hijacking-from-portugal.html', main_image: "https://lh3.googleusercontent.com/proxy/VnUN0HoTc6lyjueqR10TiagK9guN72DIUQgRPFkDTIJ5PdiHrMjx5yCTV1eYhsxDE91e5skgkOvvJzaehSUxwxtIBkKsb97ZXEOM6hS-e_TBqUZ7PHD0P3AR9-ygw-bFB2On-6QOBP23nmpKbd5_", value: 8900, Keywords: "Cristiano Ronaldo, Real Madrid, Laliga, Goals", Topics: "Football, Atletism, Sports"},
    {id: 6, title: 'Merkel Vows Full Support for Portugal', publication_date: '2015-11-13', subtitle: 'Chancellor Angela Merkel of Germany sought to reassure Portuguese leaders on Monday that fiscal overhauls would be rewarded with long-term growth and stability....', web_url: 'https://www.nytimes.com/2012/11/13/business/global/merkel-vows-support-for-portugal.html', main_image: "https://e360.yale.edu/assets/site/GettyImages-1187516526_australia-fires_web2.jpg", value: 4000},
    {id: 7, title: 'Scorched Portugal Turns to the Goat as a Low-Cost Firefighter', publication_date: '2017-09-12 ', subtitle: 'Portugal is using goats to clear the underbrush that fuels wildfires in hard to reach places and abandoned lands. If only it can find shepherds to tend them.', web_url: 'https://www.nytimes.com/2019/08/17/world/europe/portugal-wildfires-goats-climate-change.html', main_image: "https://ichef.bbci.co.uk/news/640/cpsprodpb/4272/production/_115301071_gettyimages-1229485853.jpg", value: 500},
    {id: 8, title: 'France Loses a Soccer Championship, but Achieves a Rare Unity', publication_date: '2016-07-11', subtitle: 'Despite a loss, France saw the finals of the European Championships as an opportunity to unite and recover after a difficult and divisive year....', web_url: 'https://www.nytimes.com/2016/07/11/world/europe/uefa-euro-2016-france.html', main_image: "https://observatoriodocinema.uol.com.br/wp-content/uploads/2020/07/michael-jackson-obs.jpg", value: 4000},
    {id: 9, title: 'Cristiano Ronaldo, Quiet Superstar, Can Win Portugal’s Heart With Euros Title', publication_date: '2016-07-10', subtitle: 'Ronaldo has had years of success at Real Madrid but still seeks his first major title for Portugal, which faces France in the European Championships final on Sunday....', web_url: 'https://www.nytimes.com/2016/07/10/sports/soccer/cristiano-ronaldo-portugal-euro-2016-final.html', main_image: "https://lancelivre.pt/wp-content/uploads/2020/05/michael-jordan-recordes.jpg"},
    {id: 10, title: 'With Goal for Germany, Mario Gomez Vindicates Coach’s Faith", "kicker": "Euro 2015"', publication_date: '2015-06-10', subtitle: 'Germany took a hard-earned 1-0 victory over Portugal in its opening match of Euro 2012 with a late goal by Mario Gomez, who made an unexpected start....', web_url: 'https://www.nytimes.com/2012/06/10/sports/soccer/euro-2012-late-goal-by-mario-gomez-lifts-germany.html', main_image: "https://bordalo.observador.pt/v2/q:85/rs:fill:2000/c:2000:1123:nowe:0:210/plain/https://s3.observador.pt/wp-content/uploads/2021/07/16123740/sl-benfica.jpeg"},
    {id: 11, title: 'Europe Decides Against Fines for Spain and Portugal', publication_date: '2013-07-28', subtitle: 'Officials apparently feared that punishing the countries for overspending would have spurred more austerity and helped fuel anti-European movements....', web_url: 'https://www.nytimes.com/2016/07/28/business/eu-spain-portugal-budget-fines.html', main_image: "https://www.clementoni.com/media/prod/pt/35071/fresian-black-horse-500-pecas-high-quality-collection_vAKiTEG.jpg"},

];

// Ordenar o vetor pela data
dataset1.sort(function(a, b) {
    var c = new Date(a.publication_date);
    var d = new Date(b.publication_date);
    return c-d;
});

const RelevantHeadlines = ({brushExtent}) => (



    <div style={{fontStyle: "unset", marginTop: "20px"}}>

        <Card style={{ width: '20em' }}>
            <Card.Header>Relevant headlines from <b>{brushExtent[0]}</b> to <b>{brushExtent[1]}</b></Card.Header>
            <ListGroup variant="flush">

                {dataset1.map(news => (
                    <ListGroup.Item style={{fontSize: '12px', color:'#3e5569'}}> {news.title} <b>{news.publication_date} </b></ListGroup.Item>))}
            </ListGroup>

        </Card>

    </div>



);


export default RelevantHeadlines;
