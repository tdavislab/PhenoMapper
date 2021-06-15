class Regression{

    constructor(cols){
        this.selectable_cols = cols;
        this.dependent_var = this.selectable_cols[0];
        this.indep_vars_selectable = this.selectable_cols.slice(1);
        this.indep_vars_selected = [];
        this.indep_idx = 1;
        console.log("selectable cols",this.selectable_cols) 
        console.log(this.dependent_var)

        this.clear_result();
        this.draw_dependent_var();
        this.add_var();
        this.initialize_new_select();
        this.change_vars();
    }

    draw_dependent_var(){
        let dg = d3.select("#regression-dependent").selectAll("option").data(this.selectable_cols);
        dg.exit().remove();
        dg = dg.enter().append("option").merge(dg)
            .html(d=>d);
    }

    add_var(){
        d3.select("#adding-var")
            .on("click",()=>{
                if(this.indep_vars_selectable.length>0){
                    let row = d3.select("#regression-independent-container").append("div").classed("row", true).attr("id","regression-independent-container-"+this.indep_idx);
                    let select_div = row.append("div").classed("col-sm-10", true)
                        .style("padding-top","5px");
                    let symbol_div = row.append("div").classed("col-sm-2", true)
                        .style("padding","0")
                        .style("padding-top","10px");
                    select_div.append("select")
                        .classed("custom-select",true)
                        .style("width","100%")
                        .attr("id", "regression-independent-"+this.indep_idx);
                    symbol_div.append("i")
                        .classed("fas fa-minus-circle", true)
                        .style("font-size", "15px")
                        .attr("id", "deleting-var-"+this.indep_idx);
                    this.initialize_new_select();
                    this.change_vars();
                } else {
                    alert("You have selected all variables!")
                }
                
            })
    }

    initialize_new_select(){
        this.draw_independent_var(this.indep_idx);
        this.indep_idx += 1;
        
    }

    draw_independent_var(indep_idx){
        let ig = d3.select("#regression-independent-"+indep_idx).selectAll("option").data(this.indep_vars_selectable);
        ig.exit().remove();
        ig = ig.enter().append("option").merge(ig)
            .html(d=>d);
        // initialize this select
        this.indep_vars_selected.push(this.indep_vars_selectable[0]);
        this.indep_vars_selectable.splice(0,1);
    }

    change_vars(){
        let that = this;
        let dp_dropdown = document.getElementById("regression-dependent");
        that.dependent_var = dp_dropdown.options[dp_dropdown.selectedIndex].text;
        dp_dropdown.onchange = function(){
            let v = dp_dropdown.options[dp_dropdown.selectedIndex].text;
            that.indep_vars_selectable = []
            that.selectable_cols.forEach(c=>{
                if(c!=v){
                    that.indep_vars_selectable.push(c);
                }
            })
            that.indep_vars_selected = [];
            that.dependent_var = v;
            for(let i=0; i<that.indep_idx-1; i++){
                let idx = i+1;
                that.draw_independent_var(idx);
            }
        }

        for(let i=0; i<this.indep_idx-1; i++){
            let idx = i+1;
            let ip_dropdown = document.getElementById("regression-independent-"+idx);
            that.indep_vars_selected[i] = ip_dropdown.options[ip_dropdown.selectedIndex].text;
            ip_dropdown.onchange = function(){
                let v = ip_dropdown.options[ip_dropdown.selectedIndex].text;
                let n = that.indep_idx;
                that.indep_idx = idx+1;
                that.indep_vars_selected = that.indep_vars_selected.slice(0,idx);
                that.indep_vars_selected[i] = v;
                that.indep_vars_selectable = [];
                that.selectable_cols.forEach(c=>{
                    if(that.indep_vars_selected.indexOf(c)===-1 && c!=that.dependent_var){
                        that.indep_vars_selectable.push(c);
                    }
                })
                for(let j=idx+1;j<n;j++){
                    that.initialize_new_select();
                }
            }
        }

        for(let i=0; i<this.indep_idx-1; i++){
            let idx = i+1;
            d3.select("#deleting-var-"+idx)
                .on("click",()=>{
                    this.indep_vars_selectable.push(this.indep_vars_selected[i]);
                    this.indep_vars_selected.splice(i,1);
                    // console.log(this.indep_vars_selectable, this.indep_vars_selected)
                    $("#regression-independent-container-"+idx).remove();
                    for(let k=i+1; k<this.indep_idx-1; k++){
                        let k_idx = k+1;
                        d3.select("#regression-independent-container-"+k_idx).attr("id","regression-independent-container-"+(k_idx-1));
                        d3.select("#deleting-var-"+k_idx).attr("id","deleting-var-"+(k_idx-1));
                        d3.select("#regression-independent-"+k_idx).attr("id", "regression-independent-"+(k_idx-1));
                        let ig = d3.select("#regression-independent-"+(k_idx-1)).selectAll("option").data([this.indep_vars_selected[k-1]].concat(this.indep_vars_selectable));
                        ig.exit().remove();
                        ig = ig.enter().append("option").merge(ig)
                                .html(d=>d);
                    }
                    this.indep_idx -= 1;
                    this.change_vars();
                })
        }
    }

    clear_result(){
        $('#regression-result').remove();
        $('#regression-result-constant').remove();
        $('.reg-result_title').remove();
        $('#regression-constant-line').remove();
        d3.selectAll(".reg_vals").remove();
    }

    draw_reg_result(res){
        console.log(res)
        this.clear_result();
        d3.select("#regression-panel").select(".block_body-inner").append("div").classed("reg-result_title",true).append("h6").html("Regression Result");
        let result_container = d3.select("#regression-panel").select(".block_body-inner").append("div")
            .classed("row", true)
            .attr("id","regression-result")
            .style("padding-top","5px")
            .style("padding-bottom","0px")
            .style("margin-bottom","0px");
        
        let indep_vars_container = result_container.append("div")
            .classed("col-sm-3", true)
            .classed("scrollable-horizontal", true);
        indep_vars_container.append("text").html("vars").style("visibility", "hidden");
        let indep_vars_ul = indep_vars_container.append("ul");

        let coef_container = result_container.append("div")
            .classed("col-sm-2", true);
        coef_container.append("text").html("coef").classed("reg_title", true);
        let coef_ul = coef_container.append("ul");

        let std_container = result_container.append("div")
            .classed("col-sm-3", true);
        std_container.append("text").html("std err").classed("reg_title", true);
        let std_ul = std_container.append("ul");

        let pvalue_container = result_container.append("div")
            .classed("col-sm-4", true);
        pvalue_container.append("text").html("p-value").classed("reg_title", true);
        let pvalue_ul = pvalue_container.append("ul");


        // let ig = indep_vars_ul.selectAll("li").data(['constant'].concat(this.indep_vars_selected));
        // ig.exit().remove();
        // ig = ig.enter().append("ul").merge(ig)
        //     .html(d=>d);

        // let cg = coef_ul.selectAll("li").data(res.params);
        // cg.exit().remove();
        // cg = cg.enter().append("ul").merge(cg)
        //     .html(d=>Math.round(d*1000)/1000);

        // let sg = std_ul.selectAll("li").data(res.stderr);
        // sg.exit().remove();
        // sg = sg.enter().append("ul").merge(sg)
        //     .html(d=>Math.round(d*1000)/1000);

        // let pg = pvalue_ul.selectAll("li").data(res.pvalues);
        // pg.exit().remove();
        // pg = pg.enter().append("li").merge(pg)
        //     .html(d=>Math.round(d*1000)/1000);
        
        let ig = indep_vars_ul.selectAll("li").data(this.indep_vars_selected);
        ig.exit().remove();
        ig = ig.enter().append("ul").merge(ig)
            .classed("indep_vars_selected", true)
            .html(d=>d);

        let f = d3.format(".3f");

        let cg = coef_ul.selectAll("li").data(res.params.slice(1));
        cg.exit().remove();
        cg = cg.enter().append("ul").merge(cg)
            .html(d=>f(d));

        let sg = std_ul.selectAll("li").data(res.stderr.slice(1));
        sg.exit().remove();
        sg = sg.enter().append("ul").merge(sg)
            .html(d=>f(d));

        let pg = pvalue_ul.selectAll("li").data(res.pvalues.slice(1));
        pg.exit().remove();
        pg = pg.enter().append("li").merge(pg)
            .html(d=>f(d));

        d3.select("#regression-panel").select(".block_body-inner").append("div")
            .style("padding-left","45")
            .style("padding-right","45")
            .style("border-top","1px solid #D3DBE2")
            .attr("id", "regression-constant-line");
        let constant_container = d3.select("#regression-panel").select(".block_body-inner").append("div")
            .classed("row", true)
            .attr("id","regression-result-constant")
            // .style("border-top", "1px solid #D3DBE2")
            .style("padding-top","0px");
        let indep_vars_container_c = constant_container.append("div")
            .classed("col-sm-3", true)
            .classed("scrollable-horizontal", true);
        // indep_vars_container.append("text").html("vars").style("visibility", "hidden");
        indep_vars_container_c.append("ul").append("li").html("constant");
        
        let coef_container_c = constant_container.append("div")
            .classed("col-sm-2", true);
        coef_container_c.append("ul").append("li").html(f(res.params[0]));

        let std_container_c = constant_container.append("div")
            .classed("col-sm-3", true);
        std_container_c.append("ul").append("li").html(f(res.stderr[0]));

        let pvalue_container_c = constant_container.append("div")
            .classed("col-sm-4", true);
        pvalue_container_c.append("ul").append("li").html(f(res.pvalues[0]));

        let rsquared_container = d3.select("#regression-panel").select(".block_body-inner").append("div")
            .classed("reg_vals", true)
            .classed("row", true);
        rsquared_container.append("div")
            .classed("col-sm-3", true)
            .style("font-weight", "bold")
            .html("R-squared");
        rsquared_container.append("div")
            .classed("col-sm-4", true)
            .html(f(res.rsquared));
        
        let rsquared_adj_container = d3.select("#regression-panel").select(".block_body-inner").append("div")
            .classed("reg_vals", true)
            .classed("row", true);
        rsquared_adj_container.append("div")
            .classed("col-sm-3", true)
            .style("font-weight", "bold")
            .html("Adj. R-squared");
        rsquared_adj_container.append("div")
            .classed("col-sm-4", true)
            .html(f(res.rsquared_adj));

        let fvalue_container = d3.select("#regression-panel").select(".block_body-inner").append("div")
            .classed("reg_vals", true)
            .classed("row", true);
        fvalue_container.append("div")
            .classed("col-sm-3", true)
            .style("font-weight", "bold")
            .html("F-value");
        fvalue_container.append("div")
            .classed("col-sm-4", true)
            .html(f(res.fvalue));

        this.draw_predictions(res.y_actual, res.y_predicted);
        this.draw_residuals(res.y_predicted, res.std_residuals);
        
    }
    draw_predictions(y_actual, y_pred){
        $("#prediction_svg_container").remove();

        let panel_body_inner = d3.select("#regression-panel").select(".block_body-inner");
        let prediction_svg_container = panel_body_inner.append("div").attr("id", "prediction_svg_container")
        prediction_svg_container.append("div")
            .style("padding-left","45px")
            .style("padding-right","45px")
            .style("border-top","1px solid #D3DBE2")
            .attr("id", "regression-constant-line");
        prediction_svg_container.append("div").style("padding-top", "5px").append("h6").html("Predicted vs Actual");
        let margin = {"left":55, "top":10, "right":10, "bottom":35};
        let width = $(panel_body_inner.node()).width();
        let height = width/5*3+5;

        let x = y_pred;
        let y = y_actual;

        let all_vals = x.concat(y);

        let xScale = d3.scaleLinear()
            .domain([Math.min(...all_vals), Math.max(...all_vals)])
            .range([margin.left, width-margin.right]);
        
        let yScale = d3.scaleLinear()
            .domain([Math.min(...all_vals), Math.max(...all_vals)])
            .range([height-margin.bottom, margin.top]);

        let module_svg = prediction_svg_container.append("svg")
            .attr("width", width)
            .attr("height", height);
        module_svg.append("g").attr("id", "regression_predictions_axis_group");
        module_svg.append("g").attr("id", "regression_predictions_circle_group");

        module_svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", height-margin.bottom)
            .attr("x2", width-margin.right)
            .attr("y2", margin.top)
            .attr("stroke", "grey")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", ("3, 3"))
            .style("opacity", 0.8)

        let cg = d3.select("#regression_predictions_circle_group").selectAll("circle").data(x);
        cg.exit().remove();
        cg = cg.enter().append("circle").merge(cg)
            .attr("cx", d=>xScale(d))
            .attr("cy", (d,i)=>yScale(y[i]))
            .attr("r", 2.5)
            // .attr("r",1.8)
            // .attr("fill", "orange")
            .attr("fill", (d,i)=>{
                // return color[this.data.color_col[i]];
                return "#1f77b4";
            })
            .style("opacity", 0.6)

         // x-axis
         d3.select("#regression_predictions_axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5)
                    .tickFormat(d=>d3.format(".3f")(d))
                )
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        
        d3.select("#regression_predictions_axis_group").append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Predicted values");
        
        // y-axis
        d3.select("#regression_predictions_axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5)
                    .tickFormat(d=>d3.format(".3f")(d))
                )
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");

        d3.select("#regression_predictions_axis_group").append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -(height/2-margin.top))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Actual values"); 



    }

    draw_residuals(y_pred, std_residuals){
        $("#residuals_svg_container").remove();
        
        let panel_body_inner = d3.select("#regression-panel").select(".block_body-inner");
        let residuals_svg_container = panel_body_inner.append("div").attr("id", "residuals_svg_container");
        residuals_svg_container.append("div")
            .style("padding-left","45px")
            .style("padding-right","45px")
            .style("margin-top", "10px")
            .style("border-top","1px solid #D3DBE2")
            .attr("id", "regression-constant-line");
        residuals_svg_container.append("div").style("padding-top", "5px").append("h6").html("Residuals");
        let margin = {"left":55, "top":10, "right":10, "bottom":35};
        let width = $(panel_body_inner.node()).width();
        let height = width/5*3+5;

        let x = y_pred;
        let y = std_residuals;

        let xScale = d3.scaleLinear()
            .domain([Math.min(...x), Math.max(...x)])
            .range([margin.left, width-margin.right]);
        
        let yScale = d3.scaleLinear()
            .domain([Math.min(...y), Math.max(...y)])
            .range([height-margin.bottom, margin.top]);

        let module_svg = residuals_svg_container.append("svg")
            .attr("width", width)
            .attr("height", height);
        module_svg.append("g").attr("id", "regression_residuals_axis_group");
        module_svg.append("g").attr("id", "regression_residuals_circle_group");

        module_svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", yScale(0))
            .attr("x2", width-margin.right)
            .attr("y2", yScale(0))
            .attr("stroke", "grey")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", ("3, 3"))
            .style("opacity", 0.8)

        let cg = d3.select("#regression_residuals_axis_group").selectAll("circle").data(x);
        cg.exit().remove();
        cg = cg.enter().append("circle").merge(cg)
            .attr("cx", d=>xScale(d))
            .attr("cy", (d,i)=>yScale(y[i]))
            .attr("r", 2.5)
            // .attr("r",1.8)
            // .attr("fill", "orange")
            .attr("fill", (d,i)=>{
                // return color[this.data.color_col[i]];
                return "#1f77b4";
            })
            .style("opacity", 0.6);
        
        // x-axis
        d3.select("#regression_residuals_axis_group").append("g") 
            .call(d3.axisBottom(xScale).ticks(5)
                    .tickFormat(d=>d3.format(".3f")(d))
                )
            .classed("axis_line", true)
            .attr("transform", "translate(0,"+(height-margin.bottom)+")");
        d3.select("#regression_residuals_axis_group").append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Predicted values");
    
        // y-axis
        d3.select("#regression_residuals_axis_group").append("g")
            .call(d3.axisLeft(yScale).ticks(5)
                    .tickFormat(d=>d3.format(".3f")(d))
                )
            .classed("axis_line", true)
            .attr("transform", "translate("+margin.left+",0)");

        d3.select("#regression_residuals_axis_group").append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -(height/2-margin.top))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Standardized Residuals");

    }
}