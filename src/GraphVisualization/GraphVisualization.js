import {Sigma, RandomizeNodePositions, RelativeSize, SigmaEnableSVG  } from 'react-sigma';
import React from "react";






export const Graph_visualization = () => {


    let myGraph = {nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]};



    return (
        <div>

            <Sigma graph={myGraph} renderer="svg" settings={{drawEdges: true, clone: false} }>
                <RelativeSize initialSize={15}/>
                <RandomizeNodePositions/>
            </Sigma>
        </div>
    );

}
export default Graph_visualization;
