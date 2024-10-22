import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import classes from "./Map.module.css"
import {axiosInstance} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import {TigerBookMap} from "@types/types";
import CityOptionListBox from "@components/CityOptionListBox/CityOptionListBox";
// import TitleListBox from "@components/TitleListBox/TitleListBox";
// import AuthorListBox from "@components/AuthorListBox/AuthorListBox";
// import AuthorAndTitleRadioGroup from "@components/AuthorAndTitleRadioGroup/AuthorAndTitleRadioGroup";
// import CityOptionListBox from "@components/CityOptionListBox/CityOptionListBox";

function TigerMap() {
    let defaultColor = '#FF8911';
    let highlightColor = '#FF9E3A';

    const [type, setType] = useState({name: 'By Hometown', desc: 'Explore hometown frequency on map'});

    const svgRef = React.useRef(null);


    useEffect(() => {
        const width = 960;
        const height = 500;
        const FILE = "/static/earth-coastlines-10km.geo.json";

        const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${width} ${height}`)

        const globe = svg.append("g");

        const projection = d3.geoMercator().scale(width / 3 / Math.PI)
            .center([20, 30])
            .translate([width / 2, height / 2]);

        const geoPath = d3.geoPath()
            .projection(projection);

        const map = {
            features: undefined
        };


        d3.json(FILE)
            .then(function (shapes) {
                map.features = shapes.features;
                draw();
                drawTooltips();
                drawButtons();
                drawPointsOfInterest()
            });

        async function drawPointsOfInterest() {
            let axios = await axiosInstance()
            let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/map/hometown/`)
            const mapData: TigerBookMap[] = axiosResponse.data
            // d3.json('/static/cleaned-data-12-4.geojson').then(function (data) {
            // let pointsOfInterest = mapData.filter(d => d.geometry.type === 'Point');
            mapData.sort((a, b) => d3.descending(a.count, b.count));

            svg.select("g").selectAll("g.city").data(mapData).enter()
                .append("g").attr("class", "city")
                .attr("transform", d => `translate(${[projection([d.longitude, d.latitude])]})`)
                .each(function (d1) {
                    d3.select(this).append("circle").attr("fill", highlightColor).raise()
                        .attr('r', Math.sqrt(d1.count) + 2)
                        .attr('transform', `scale(${(1)})`)
                        .on("mouseenter", (d2) => {
                            showTooltip(d2);
                            d3.select(this).select("circle").attr("fill", highlightColor);
                        })
                        .on("mouseleave", () => {
                            hideTooltip();
                            d3.select(this).select("circle").attr("fill", defaultColor);
                        })
                });
            // })
        }


        const zoom = d3.zoom()
            .scaleExtent([1, 600])
            .translateExtent([[0, 0], [width, height]])
            .on('zoom', () => {
                const currentTransform = d3.event.transform;
                globe.attr("transform", currentTransform);
                // console.log(currentTransform.k)
                d3.select("g").selectAll("circle").attr("transform", function (d, i, n) {
                    return `scale(${(1 / currentTransform.k)})`
                })
            });

        svg.call(zoom).on("dblclick.zoom", null).on("wheel.zoom", null);

        function drawButtons() {
            const buttonDiv = svg.append("foreignObject")
                .attr("x", 920).attr("y", 435).attr("width", "29px").attr("height", "49px").style("border-radius", "8px")
                .style("background-color", "white")
                .style("box-shadow", "0 1px 4px rgb(0 0 0 / 30%)")
                .append("xhtml:div").style("cursor", "pointer")
            buttonDiv.append("div").attr("id", "zoom_in")
                .append("xhtml:button").text("+").style("display", "block")
                .attr("height", "24px").attr("width", "14px")
                .style("margin", "0 auto").style("font-family", "monospace").style("padding", "2px 0")
            buttonDiv.append("hr")
            buttonDiv.append("div").attr("id", "zoom_out")
                .append("xhtml:button").text("-").style("display", "block")
                .attr("height", "24px").attr("width", "14px")
                .style("margin", "0 auto").style("font-family", "monospace").style("padding", "2px 0")
            d3.select("#zoom_in").on("click", function () {
                zoom.scaleBy(svg.transition().duration(300), 1.5);
            });
            d3.select("#zoom_out").on("click", function () {
                zoom.scaleBy(svg.transition().duration(300), 0.5);
            });
        }

        function drawTooltips() {
            svg.append("g").attr("id", "tooltip")
                .style("opacity", 0)
                .each(function (d) {
                    d3.select(this).append("rect")
                        .attr("height", 45)
                        .attr("width", 600)
                        .attr("rx", 5).attr("ry", 5)
                        .attr("x", -300).attr("y", -20)
                    d3.select(this).append("text")
                        .attr("x", 0)
                        .attr("y", -5)
                    d3.select(this).append("text")
                        .attr("x", 0)
                        .attr("y", 15);
                    // d3.select(this).append("text")
                    //     .attr("x", 0)
                    //     .attr("y", 35);
                    // d3.select(this).append("text")
                    //     .attr("x", 0)
                    //     .attr("y", 55);
                    // d3.select(this).append("text")
                    //     .attr("x", 0)
                    //     .attr("y", 75);
                })
        }

        function showTooltip(d : TigerBookMap) {
            const coords = d3.mouse(svg.node())
            const tooltip = d3.select("#tooltip")
                .attr("transform", `translate(${[coords[0], coords[1] + 40]})`)
                .style("opacity", 1);
            tooltip.select("text:first-of-type")
                .text(`Location: ${d.complete_city}`)
            tooltip.select("text:nth-of-type(2)")
                .text(`# of Affiliations: ${d.count}`)
            // tooltip.select("text:nth-of-type(3)")
            //     .text(`Author: ${authorMapper[titleMapper[d.properties.original_book_title]]}`)
            // tooltip.select("text:nth-of-type(4)")
            //     .text(`Count in Text: ${d.properties.original_count}`)
            // tooltip.select("text:last-child")
            //     .text(`Total Count Across All Texts: ${d.properties.original_total_count}`)
        }

        function hideTooltip() {
            d3.select("#tooltip").style("opacity", 0)
        }

        function draw() {
            globe.selectAll("path.country")
                .data(map.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr('d', geoPath).lower()
        }

        // function drawGraticules() {
        //     console.log(d3.geoGraticule10())
        //     globe.append("path").attr("class", "graticule")
        //         .datum(d3.geoGraticule10())
        //         .attr('d', geoPath)
        // }
    }, [svgRef])

    useEffect(() => {
        const width = 960;
        const height = 500;

        const projection = d3.geoMercator().scale(width / 3 / Math.PI)
            .center([20, 30])
            .translate([width / 2, height / 2]);

        function showTooltip(d) {
            // @ts-ignore
            const coords = d3.mouse(d3.select(svgRef.current).node())
            const tooltip = d3.select("#tooltip")
                .attr("transform", `translate(${[coords[0], coords[1] + 40]})`)
                .style("opacity", 1);
            tooltip.select("text:first-of-type")
                .text(`Location: ${d.complete_city}`)
            tooltip.select("text:nth-of-type(2)")
                .text(`# of Affiliations: ${d.count}`)
        }

        function hideTooltip() {
            d3.select("#tooltip").style("opacity", 0)
        }

        async function updateHometowns() {
            d3.select(svgRef.current).select("g").selectAll("g.city").remove();

            let axios = await axiosInstance()
            let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/map/hometown/`)
            const mapData: TigerBookMap[] = axiosResponse.data
            // d3.json('/static/cleaned-data-12-4.geojson').then(function (data) {
            // let pointsOfInterest = mapData.filter(d => d.geometry.type === 'Point');
            mapData.sort((a, b) => d3.descending(a.count, b.count));

            d3.select(svgRef.current).select("g").selectAll("g.city").data(mapData).enter()
                .append("g").attr("class", "city")
                .attr("transform", d => `translate(${[projection([d.longitude, d.latitude])]})`)
                .each(function (d1) {
                    const globe = d3.select(svgRef.current).select("g");
                    let currentScaleValue = globe.attr("transform")
                    if (currentScaleValue === null) {
                        currentScaleValue = 1;
                    } else {
                        let regex = /[+-]?\d+(\.\d+)?/g;
                        let floats = currentScaleValue.match(regex).map(function (v) {
                            return parseFloat(v);
                        });
                        currentScaleValue = floats[2]
                    }
                    currentScaleValue = 1 / currentScaleValue
                    d3.select(this).append("circle").raise()
                        .attr('r', Math.sqrt(d1.count) + 2)
                        .attr('transform', `scale(${currentScaleValue})`)
                        .on("mouseenter", (d2) => {
                            showTooltip(d2);
                            d3.select(this).select("circle").attr("fill", highlightColor);
                        })
                        .on("mouseleave", () => {
                            hideTooltip();
                            // Add +1 to i1 index because 0th index is path.country while rest are g.city
                            d3.select(this).select("circle").attr("fill", defaultColor)
                        })
                });
        }

        async function updateCurrentCities() {
            d3.select(svgRef.current).select("g").selectAll("g.city").remove();

            let axios = await axiosInstance()
            let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/map/current-city/`)
            const mapData: TigerBookMap[] = axiosResponse.data
            // d3.json('/static/cleaned-data-12-4.geojson').then(function (data) {
            // let pointsOfInterest = mapData.filter(d => d.geometry.type === 'Point');
            mapData.sort((a, b) => d3.descending(a.count, b.count));

            d3.select(svgRef.current).select("g").selectAll("g.city").data(mapData).enter()
                .append("g").attr("class", "city")
                .attr("transform", d => `translate(${[projection([d.longitude, d.latitude])]})`)
                .each(function (d1) {
                    const globe = d3.select(svgRef.current).select("g");
                    let currentScaleValue = globe.attr("transform")
                    if (currentScaleValue === null) {
                        currentScaleValue = 1;
                    } else {
                        let regex = /[+-]?\d+(\.\d+)?/g;
                        let floats = currentScaleValue.match(regex).map(function (v) {
                            return parseFloat(v);
                        });
                        currentScaleValue = floats[2]
                    }
                    currentScaleValue = 1 / currentScaleValue
                    d3.select(this).append("circle").raise()
                        .attr('r', Math.sqrt(d1.count) + 2)
                        .attr('transform', `scale(${currentScaleValue})`)
                        .on("mouseenter", (d2) => {
                            showTooltip(d2);
                            d3.select(this).select("circle").attr("fill", highlightColor);
                        })
                        .on("mouseleave", () => {
                            hideTooltip();
                            // Add +1 to i1 index because 0th index is path.country while rest are g.city
                            d3.select(this).select("circle").attr("fill", defaultColor)
                        })
                });
        }

        // @ts-ignore
        if (type.name === 'By Hometown') {
            updateHometowns()
        } else {
            updateCurrentCities()
        }


    }, [type]);


    return (
        <>
            <div id="chart" className="relative">
                <CityOptionListBox onChange={setType}/>
                <svg className="w-full h-full rounded-2xl" ref={svgRef} id="svg-main" xmlns="http://www.w3.org/1999/xhtml"/>
            </div>
        </>
    );
}

export default TigerMap;
