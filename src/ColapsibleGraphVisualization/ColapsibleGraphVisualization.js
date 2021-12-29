import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {Card, Carousel} from "react-bootstrap";
import './ColapsibleGraphVisualization.css';
import React, {useEffect, useRef} from "react";
import axios from "axios";


export const ColapsibleGraphVisualization = ({}) => {

    const divRef = useRef();
    useEffect(() => {

        axios.get('http://localhost:3000/api/request/umap', {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response => {

    var root = am5.Root.new("chartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    var data = {
        name: "Root",
        value: 0,
        children: [
            {
                name: "1",
                linkWith: ["2"],
                children: [
                    {
                        name: "A",
                        children: [
                            {name: "A1", value: 1},
                            {name: "A2", value: 1},
                            {name: "A3", value: 1},
                            {name: "A4", value: 1},
                            {name: "A5", value: 1}
                        ]
                    },
                    {
                        name: "B",
                        children: [
                            {name: "B1", value: 1},
                            {name: "B2", value: 1},
                            {name: "B3", value: 1},
                            {name: "B4", value: 1},
                            {name: "B5", value: 1}
                        ]
                    },
                    {
                        name: "C",
                        children: [
                            {name: "C1", value: 1},
                            {name: "C2", value: 1},
                            {name: "C3", value: 1},
                            {name: "C4", value: 1},
                            {name: "C5", value: 1}
                        ]
                    }
                ]
            },

            {
                name: "2",
                linkWith: ["3"],
                children: [
                    {
                        name: "D", value: 1
                    },
                    {
                        name: "E", value: 1
                    }
                ]
            },
            {
                name: "3",
                children: [
                    {
                        name: "F",
                        children: [
                            {name: "F1", value: 1},
                            {name: "F2", value: 1},
                            {name: "F3", value: 1},
                            {name: "F4", value: 1},
                            {name: "F5", value: 1}
                        ]
                    },
                    {
                        name: "H",
                        children: [
                            {name: "H1", value: 1},
                            {name: "H2", value: 1},
                            {name: "H3", value: 1},
                            {name: "H4", value: 1},
                            {name: "H5", value: 1}
                        ]
                    },
                    {
                        name: "G",
                        children: [
                            {name: "G1", value: 1},
                            {name: "G2", value: 1},
                            {name: "G3", value: 1},
                            {name: "G4", value: 1},
                            {name: "G5", value: 1}
                        ]
                    }
                ]
            }
        ]
    };

// Create wrapper container
    var container = root.container.children.push(
        am5.Container.new(root, {
            width: am5.percent(100),
            height: am5.percent(100),
            layout: root.verticalLayout,

        })
    );

// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    var series = container.children.push(
        am5hierarchy.ForceDirected.new(root, {
            singleBranchOnly: false,
            downDepth: 1,
            topDepth: 1,
            maxRadius: 10,
            minRadius: 10,
            valueField: "value",
            categoryField: "name",
            childDataField: "children",
            idField: "name",
            linkWithStrength: 0.3,
            linkWithField: "linkWith",
            manyBodyStrength: -25,
            centerStrength: 0.5
        })
    );

    series.get("colors").set("step", 2);

    series.data.setAll([response.data]);
    series.set("selectedDataItem", series.dataItems[0]);

// Make stuff animate on load
    series.appear(1000, 100);
        })

    }, []);


    return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;

}

export default ColapsibleGraphVisualization
