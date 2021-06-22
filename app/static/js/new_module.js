class New_Module{
    constructor(module_info){
        this.module_name = module_info.name;
        this.module_id = module_info.id;
        this.components = module_info.components;
        if(this.module_id === "feature_selection"){
            this.add_feature_selection_module();
        } else if(this.module_id === "scatter_plot"){
            this.add_scatter_plot_module();
        }else{
            this.draw_new_module();
        }
    }

    clear_canvas(){
        $("#"+this.module_id+"_svg").remove();
        d3.selectAll(".new_module_container").remove();
    }

    add_scatter_plot_module(){
        this.clear_canvas();
        this.draw_panel_container();
        this.draw_panel_title();
        let panel_container = this.panel_body_inner;
        // select x axis
        let x_container = panel_container.append("div").classed("parameter-group", true);
        let x_row = x_container.append("div").classed("row", true);
        let x_name = x_row.append("div").classed("col-4", true).classed("ui-form-range__label",true)
            .html("X");
        let x_selection_container = x_row.append("div").classed("col-8",true);
        this.x_selection = x_selection_container.append("select").classed("custom-select",true)
            .attr("name", this.module_id+"_x_selection")
            .attr("id", this.module_id+"_x_selection");


        // select y axis
        let y_container = panel_container.append("div").classed("parameter-group", true);
        let y_row = y_container.append("div").classed("row", true);
        let y_name = y_row.append("div").classed("col-4", true).classed("ui-form-range__label",true)
            .html("Y");
        let y_selection_container = y_row.append("div").classed("col-8",true);
        this.y_selection = y_selection_container.append("select").classed("custom-select",true)
            .attr("name", this.module_id+"_y_selection")
            .attr("id", this.module_id+"_y_selection");


        // select color function
        let color_select_container = panel_container.append("div").classed("parameter-group", true)
            .style("padding-bottom", "10px");
        let color_row = color_select_container.append("div").classed("row", true);
        let color_name = color_row.append("div").classed("col-4", true).classed("ui-form-range__label",true)
            .html("Color");
        let color_selection_container = color_row.append("div").classed("col-8",true);
        this.color_selection = color_selection_container.append("select").classed("custom-select",true)
            .attr("name", this.module_id+"_color_selection")
            .attr("id", this.module_id+"_color_selection");
        
        $("#"+this.module_id+"-block_body-inner").append("<input type='button' class='btn btn-outline-dark btn-block ui-form-button' id='"+this.module_id+"_button' value='Draw Scatter Plot'>");
    }

    add_feature_selection_module(){
        this.clear_canvas();
        this.draw_panel_container();
        this.draw_panel_title();

        // select y
        let y_container = this.panel_body_inner.append("div").classed("parameter-group", true);
        let y_row = y_container.append("div").classed("row", true);
        let y_name = y_row.append("div").classed("col-6", true).classed("ui-form-range__label",true)
            .html("Dependent Variable");
        let y_selection_container = y_row.append("div").classed("col-6",true);
            
        this.y_selection = y_selection_container.append("select").classed("custom-select",true)
            .attr("name", this.module_id+"y_selection")
            .attr("id", this.module_id+"y_selection")

        // select X
        let x_container = this.panel_body_inner.append("div").classed("columns-group-inner",true).classed("row",true).style("margin","15px 5px");
        let x_name = x_container.append("div").classed("ui-form-range__label",true)
            .html("Independent Variable");
        let x_all_cols_group = x_container.append("div").classed("columns-selection",true)
            .classed("col-6",true)
            .attr("id", this.module_id+"all-columns-group");
        let x_all_title = x_all_cols_group.append("div").classed("column-title",true)
            .style("height", "20%")
            .html("All Columns");
        this.x_all_list = x_all_cols_group.append("div").classed("scrollable", true)
            .style("height", "75%").append("ul");
        
        let x_selected_cols_group = x_container.append("div").classed("columns-selection",true)
            .classed("col-6",true)
            .attr("id", this.module_id+"selected-columns-group");
        let x_selected_title = x_selected_cols_group.append("div").classed("column-title",true)
            .style("height", "20%")
            .html("Selected Columns");
        this.x_selected_list = x_selected_cols_group.append("div").classed("scrollable", true)
            .style("height", "75%").append("ul");

        $("#"+this.module_id+"-block_body-inner").append("<input type='button' class='btn btn-outline-dark btn-block ui-form-button' id='"+this.module_id+"_button' value='Run "+this.module_name+"'>");

    }

    add_scatter_plot_columns(categorical_cols, cols){        
        let xg = this.x_selection.selectAll("option").data(cols);
        xg.exit().remove();
        xg = xg.enter().append("option").merge(xg)
            .html(d=>d);

        let yg = this.y_selection.selectAll("option").data(cols);
        yg.exit().remove();
        yg = yg.enter().append("option").merge(yg)
            .html(d=>d);

        let clg = this.color_selection.selectAll("option").data(cols.concat(categorical_cols));
        clg.exit().remove();
        clg = clg.enter().append("option").merge(clg)
            .html(d=>d);
        
        this.categorical_cols = categorical_cols;
    }

    draw_feature_names(){
        let f = d3.format(".3f");
        let score_div = this.panel_body_inner.append("div").classed("row", true)
            .style("margin", "2px")
            .style("margin-top", "10px")
            .style("padding-top", "5px")
            .style("padding-bottom", "0px")
            .style("padding-left", "0px")
            .style("border-top", "1px solid #D3DBE2")
            .style("text-align", "left");
        score_div.append("div").classed("col-6", true).html("Mean Accuracy").style("padding-left", "0px").style("font-weight", "bold");
        score_div.append("div").classed("col-3", true).html(f(this.svc_score));
        this.panel_body_inner.append("div").classed("reg-result_title",true).append("h6").html("Selected Features");
        let result_container = this.panel_body_inner.append("div").append("ul");
        result_container.selectAll("li").data(this.feature_names)
            .enter().append("li")
            .html(d=>d)
    }

    add_feature_selection_columns(categorical_cols, cols){
        console.log(cols)
        let that = this;

        let y_cols = categorical_cols.concat(cols);
        
        let yg = this.y_selection.selectAll("option").data(y_cols);
        yg.exit().remove();
        yg = yg.enter().append("option").merge(yg)
            .html(d=>d);

        this.selected_cols = [];
        this.selectable_cols = cols.slice(0);

        let y_dropdown = document.getElementById(this.module_id+"y_selection");
        this.y = y_dropdown.options[y_dropdown.selectedIndex].text;
        y_dropdown.onchange = function(){
            that.y = y_dropdown.options[y_dropdown.selectedIndex].text;
            that.selected_cols = cols.slice(0,1);
            that.selectable_cols = cols.slice(1);
            draw_all_cols();
            that.x_selected_list.selectAll("li").remove();
        }

        draw_all_cols();

        function draw_all_cols(){
            let ag = that.x_all_list.selectAll("li").data(that.selectable_cols);
            ag.exit().remove();
            ag = ag.enter().append("li").merge(ag)
                .html(d=>d)
                .on("click", d=>{
                    if(that.selected_cols.indexOf(d)===-1){
                        that.selected_cols.push(d);
                        that.selectable_cols.splice(that.selectable_cols.indexOf(d),1);
                        draw_selected_cols();
                    }
                })
        }

        function draw_selected_cols(){
            let sg = that.x_selected_list.selectAll("li").data(that.selected_cols.slice(1));
            sg.exit().remove();
            sg = sg.enter().append("li").merge(sg)
                .html(d=>d)
                .on("click", d=>{
                    if(that.selected_cols.length>2){
                        that.selected_cols.splice(that.selected_cols.indexOf(d),1);
                        that.selectable_cols.push(d);
                        draw_selected_cols();
                    } else {
                        alert("Please select at least 1 column!")
                    }
                })
        }
        

    }

    draw_panel_container(){
        let panel_container = d3.select("#sidebar-container").append("div").attr("id", this.module_id+"-panel").classed("block", true);
        panel_container.append("div").attr("id", this.module_id+"-panel_title").classed("block_title", true).html(this.module_name);
        let panel_body = panel_container.append("div").classed("block_body", true).style("max-height","1000px");
        this.panel_body_inner = panel_body.append("div").attr("id",this.module_id+"-block_body-inner").classed("block_body-inner", true);
        
    }

    draw_panel_title(){
        let panel_title = document.getElementById(this.module_id+"-panel_title");
        panel_title.addEventListener("click", function(){
            this.classList.toggle("collapsed")
            let block_body = this.nextElementSibling;
            if (block_body.style.maxHeight){
                block_body.style.maxHeight = null;
            } else {
                block_body.style.maxHeight = "1000px";
            } 
        });
    }

    draw_new_module(){
        // Module structure:
        // 1. Title: module name
        // 2. A button to run the analysis
        // 3. Components to display results (can be: scatter plot, table, etc.)

        console.log(this.module_name)
        this.draw_panel_container();
        this.draw_panel_title();
        $("#"+this.module_id+"-block_body-inner").append("<input type='button' class='btn btn-outline-dark btn-block ui-form-button' id='"+this.module_id+"_button' value='Run "+this.module_name+"'>");
    }

    add_component(c) {
        if(c==="scatter plot"){
            this.add_plot();
        } else if(c === "table"){
            this.add_table();
        } else if(c === "line graph"){
            this.add_line_graph();
        }
    }

    add_line_graph(){
        // input data: list of values

        this.clear_canvas();

        console.log(this.data)

        let margin = {"left":25, "top":20, "right":20, "bottom":20};
        let width = $(this.panel_body_inner.node()).width();
        let height = width+5;

        let module_svg = this.panel_body_inner.append("svg")
            .attr("id", this.module_id+"_svg")
            .attr("width", width)
            .attr("height", height);

        let xScale = d3.scaleLinear()
            .domain([0, this.data.length])
            .range([margin.left, width-margin.right]);

        let yScale = d3.scaleLinear()
            .domain([Math.min(...this.data), Math.max(...this.data)])
            .range([height-margin.bottom, margin.top]);

        let line = d3.line() // line generator
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d); }) 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        module_svg.append("g").attr("id", this.module_id+"_axis_group");
        module_svg.append("g").attr("id", this.module_id+"_line_group");

        d3.select("#"+this.module_id+"_line_group").append("path")
            .datum(this.data) //  Binds data to the line 
            // .attr("class", "line")
            .attr("stroke", "blue")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("d", line);

        // x-axis
        d3.select("#"+this.module_id+"_axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        
        // y-axis
        d3.select("#"+this.module_id+"_axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");
        
        

    }

    add_plot(){
        console.log(this.data)
        this.clear_canvas();

        let color_categorical;
        let color_scale;
        let color_dict
            
        if(this.categorical_cols.indexOf(this.data.color_name)!=-1){
            color_categorical = d3.scaleOrdinal(d3.schemeCategory10);
            // let color = {'KS; A':'#1f77b4', 'KS; B':'#ff7f0e', 'NE; A':'#2ca02c', 'NE; B':'#d62728'};
            color_dict = {};
            let categories = [];
            this.data.color_col.forEach(c=>{
                if(categories.indexOf(c)===-1){
                    categories.push(c);
                }
            })
            categories.sort((a,b)=>d3.ascending(a,b));
            for(let i=0; i<categories.length; i++){
                let c = categories[i];
                color_dict[c] = color_categorical(i);
            }
        } else {
            color_scale = d3.scaleLinear()
                .domain([Math.min(...this.data.color_col), Math.max(...this.data.color_col)])
                .range(["yellow", "red"]);
        }

        let margin = {"left":20, "top":20, "right":10, "bottom":15};
        let width = $(this.panel_body_inner.node()).width();
        let legend_height = 80;
        let rect_height = 10;
        let rect_width = 25;
        let rect_margin = 10;
        if(this.categorical_cols.indexOf(this.data.color_name)!=-1){
            legend_height = Object.keys(color_dict).length * (rect_height+rect_margin) + rect_margin*2;
        }
        let height = width/5*3 + 5;
        let svg_height = height + legend_height;

        let x = this.data.x_col;
        let y = this.data.y_col;

        let xScale = d3.scaleLinear()
            .domain([Math.min(...x), Math.max(...x)])
            .range([margin.left, width-margin.right]);

        let yScale = d3.scaleLinear()
            .domain([Math.min(...y), Math.max(...y)])
            .range([height-margin.bottom, margin.top]);

        let module_svg = this.panel_body_inner.append("svg")
            .attr("id", this.module_id+"_svg")
            .attr("width", width)
            .attr("height", svg_height);
        module_svg.append("g").attr("id", this.module_id+"_axis_group");
        module_svg.append("g").attr("id", this.module_id+"_circle_group");
        module_svg.append("g").attr("id", this.module_id+"_legend_group");

        let cg = d3.select("#"+this.module_id+"_circle_group").selectAll("circle").data(this.data.x_col);
        cg.exit().remove();
        cg = cg.enter().append("circle").merge(cg)
            .attr("cx", d=>xScale(d))
            .attr("cy", (d,i)=>yScale(this.data.y_col[i]))
            .attr("r", 2.5)
            .attr("fill", (d,i)=>{
                if(this.categorical_cols.indexOf(this.data.color_name)!=-1){
                    return color_dict[this.data.color_col[i]];
                } else{
                    return color_scale(this.data.color_col[i]);
                }
                
            })
            .style("opacity", 0.6)

        // x-axis
        d3.select("#"+this.module_id+"_axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        
        // y-axis
        d3.select("#"+this.module_id+"_axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");

        // legend
        let legend_group = d3.select("#"+this.module_id+"_legend_group");
        if(this.categorical_cols.indexOf(this.data.color_name)!=-1){
            let color_array = d3.entries(color_dict);
            let lg = legend_group.selectAll("g").data(color_array)
                .enter().append("g")
                .attr("transform", "translate(" + rect_margin + "," + (height+2*rect_margin) + ")");
            lg.append("rect")
                .attr("x",0)
                .attr("y",(d,i)=>i*(rect_height+rect_margin))
                .attr("height", rect_height)
                .attr("width",rect_width)
                .attr("fill", d=>d.value)
                .style("opacity", 0.8);
            lg.append("text")
                .attr("x", rect_width+rect_margin*3)
                .attr("y", (d,i)=>i*(rect_height+rect_margin)+8)
                .style("font-size", "12px")
                .text(d=>d.key);
        } else {
            let axisMargin = 10;
            let colorTileNumber = 50;
            let colorTileHeight = 20;
            let colorTileWidth = (width - (axisMargin * 2)) / colorTileNumber;
            let axisDomain = color_scale.domain();

            let tickValues = [axisDomain[0], d3.mean(axisDomain), axisDomain[1]];
            let axisScale = d3.scaleLinear().domain(axisDomain).range([0, width -  axisMargin*2]);
            let axis = d3.axisBottom(axisScale).tickValues(tickValues);

            legend_group.attr("transform", `translate(${axisMargin},${height+axisMargin})`)
            legend_group.append("g").attr("transform", `translate(0,${colorTileHeight*2})`).call(axis);

            let domainStep = (axisDomain[1] - axisDomain[0])/colorTileNumber;
            let rects = d3.range(axisDomain[0], axisDomain[1], domainStep)
            let rg = legend_group.selectAll("rect").data(rects)
                .enter().append("rect")
                .attr('x', d=>axisScale(d))
            .attr('y', 10)
            .attr('width', colorTileWidth-1)
            .attr('height',colorTileHeight)
            .attr('fill', d=>color_scale(d));
        }


    }

    add_table(){
        console.log(this.data)
        this.clear_canvas();

        let result_container = d3.select("#"+this.module_id+"-block_body-inner").append("div")
            .classed("new_module_container", true);

        result_container.append("div").classed("reg-result_title",true).append("h6").html(this.module_name);
        let result_table_container = result_container.append("div")
            .classed("row", true)
            .attr("id",this.module_id + "-result")
            .style("padding-top","5px");
        
        let indep_vars_container = result_table_container.append("div")
            .classed("col-sm-3", true)
            .classed("scrollable-horizontal", true);
        indep_vars_container.append("text").html("vars").style("visibility", "hidden");
        let indep_vars_ul = indep_vars_container.append("ul");

        let coef_container = result_table_container.append("div")
            .classed("col-sm-2", true);
        coef_container.append("text").html("coef").classed("reg_title", true);
        let coef_ul = coef_container.append("ul");

        let std_container = result_table_container.append("div")
            .classed("col-sm-3", true);
        std_container.append("text").html("std err").classed("reg_title", true);
        let std_ul = std_container.append("ul");

        let pvalue_container = result_table_container.append("div")
            .classed("col-sm-4", true);
        pvalue_container.append("text").html("p-value").classed("reg_title", true);
        let pvalue_ul = pvalue_container.append("ul");


        let f = d3.format(".3f");

        let ig = indep_vars_ul.selectAll("li").data(['constant'].concat(this.data.X_names));
        ig.exit().remove();
        ig = ig.enter().append("ul").merge(ig)
            .html(d=>d);

        let cg = coef_ul.selectAll("li").data(this.data.params);
        cg.exit().remove();
        cg = cg.enter().append("ul").merge(cg)
            .html(d=>f(d));

        let sg = std_ul.selectAll("li").data(this.data.stderr);
        sg.exit().remove();
        sg = sg.enter().append("ul").merge(sg)
            .html(d=>f(d));

        let pg = pvalue_ul.selectAll("li").data(this.data.pvalues);
        pg.exit().remove();
        pg = pg.enter().append("li").merge(pg)
            .html(d=>f(d));

        let llrp_container = result_container.append("div")
            .classed("reg_vals", true)
            .classed("row", true);
        llrp_container.append("div")
            .classed("col-sm-3", true)
            .style("font-weight", "bold")
            .html("LLR p-value");
        llrp_container.append("div")
            .classed("col-sm-4", true)
            .html(f(this.data.llr_pvalue));

        // cross validation
        result_container.append("div").classed("reg-result_title",true).append("h6").html("Cross validation scores");
        let cv_container = result_container.append("div").append("div")
            .classed("row", true)
            .attr("id",this.module_id + "-cv-result")
            .style("padding-top","5px");
        for(let i=0; i<this.data.test_scores.length; i++){ // length = 5
            cv_container.append("div")
                .classed("col-2", true)
                .html(f(this.data.test_scores[i]))
        }
    }

    draw_tsne_result(){
        console.log(this.data)
        this.clear_canvas();
            
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        let margin = {"left":20, "top":20, "right":10, "bottom":15};
        let width = $(this.panel_body_inner.node()).width();
        let height = width+5;

        // let color = {'KS; A':'#1f77b4', 'KS; B':'#ff7f0e', 'NE; A':'#2ca02c', 'NE; B':'#d62728'};

        let x = this.data.map(d=>d.col1);
        let y = this.data.map(d=>d.col2);

        let xScale = d3.scaleLinear()
            .domain([Math.min(...x), Math.max(...x)])
            .range([margin.left, width-margin.right]);

        let yScale = d3.scaleLinear()
            .domain([Math.min(...y), Math.max(...y)])
            .range([margin.top, height-margin.bottom]);

        let module_svg = this.panel_body_inner.append("svg")
            .attr("id", this.module_id+"_svg")
            .attr("width", width)
            .attr("height", height);
        module_svg.append("g").attr("id", this.module_id+"_axis_group");
        module_svg.append("g").attr("id", this.module_id+"_circle_group");

        let cg = d3.select("#"+this.module_id+"_circle_group").selectAll("circle").data(this.data);
        cg.exit().remove();
        cg = cg.enter().append("circle").merge(cg)
            .attr("cx", d=>xScale(d.col1))
            .attr("cy", d=>yScale(d.col2))
            .attr("r", 3)
            // .attr("r", (d)=>{
            //     if(d.color_col === 1){
            //         return 3
            //     } else {
            //         return 0
            //     }
            // })
            // .attr("fill", "orange")
            .attr("fill", d=>{
                return color(d.color_col);
                // return color[d.color_col];
            })
            .style("opacity", 0.6);

        // x-axis
        d3.select("#"+this.module_id+"_axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        
        // y-axis
        d3.select("#"+this.module_id+"_axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");

        // legend


    }
}