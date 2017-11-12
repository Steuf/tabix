/*
 * Licensed under the Apache License, Version 2.0 Copyright 2017 Igor Strykhar,Ivan Kudinov,SMI2 LLC and other contributors
 */

'use strict';

class DrawPlotly extends DrawBasicChart {

    constructor(Widget, drawType) {
        super(Widget);
        this.type = drawType.toUpperCase();
        this.library = 'plotly';
        this.chart=null;
        this.setWidgetSize(6,3);
        this._datajs=false;
    }

    onResize() {
        if (this.plotly)
        {
            let h=this.widget.getSizeElementHeight();
            let w=this.widget.getSizeElementWidth();
            if (this.layout.height!=h || this.layout.width!=w)
            {
                this.layout.height=h;
                this.layout.width=w;
                this.relayout();
            }
        }
    }


    preProcessor() {

        // <script src=""></script>
        if (this.initChartByJsCode()) {
        }
        else {

        }

        if (this.getError()) {
            console.error(this.getError());

            this.chart.before("<p>" + this.getError() + "</p>");

            return false;
        }


        if (this.isDark()) {
            // this.options.backgroundColor = '#404a59';
            // drw.color = ['#1a4882','#dd4444', '#fec42c', '#80F1BE'];
        }
        // log
        this.init = this.create();

        console.info('preProcessor', this.init);
    }


    getElement(){
        return this.widget.element[0];
    }
    relayout() {

        Plotly.relayout(this.getElement(),this.layout);
    }
    editor() {
        console.info("editoreditoreditor");
    }

    getDataForCodeJS() {
        // @todo : optimize

        if (this._datajs) return this._datajs;
        let data={};
        let columns=this.getColumns();
        let len = this.data().length;
        for (let index = 0; index < len; ++index) {
            let item=this.data()[index];
            for ( let colPos in columns) {
                let col = columns[colPos];

                if (!data[col]) data[col]=[];
                data[col].push(item[col]);
            }
        }
        this._datajs=data;
    }
    applyCode() {


        try {

            let codeJS = this.getCode();
            let data = this.getDataForCodeJS();

            codeJS = '(' + codeJS + ')';
            let obj = eval(codeJS);

            if (_.isObject(obj)) {
                this.applyObject(obj);
            }

        } catch (E) {

        }

    }

    applyObject(drw) {

        let ll={
            data:[],
            layout:{}
        };

        if (_.isObject(drw))
        {

            if( _.isObject(drw.trace))  { ll.data.push(drw.trace);}
            if( _.isObject(drw.trace1)) { ll.data.push(drw.trace1);}
            if( _.isObject(drw.trace2)) { ll.data.push(drw.trace2);}
            if( _.isObject(drw.trace3)) { ll.data.push(drw.trace3);}
            if( _.isObject(drw.trace4)) { ll.data.push(drw.trace4);}
            if( _.isObject(drw.layout)) { ll.layout=drw.layout;}

        }
        console.info(ll);

        let xll=[
            {
                x:[1,2],
                y:[1,2],
                type:'bar'
            }
        ];
        console.log("CONS:",xll);
        console.log("llll:",ll);

        let settings={
            editable:false,
            // modeBarButtonsToAdd: [{
            //     name: 'custom button',
            //     icon: Plotly.Icons['coffee'],
            //     click: function() {
            //         this.editor()
            //     }
            // }]
        };

        this.layout=ll.layout;

        let h=this.widget.getSizeElementHeight();
        let w=this.widget.getSizeElementWidth();
        this.layout.height=h;
        this.layout.width=w;


        this.layout=Object.assign(this.layout,this.getDarkThemeLayout());


        if (this.plotly)
        {
            console.info("UPDATE!");
            this.plotly=Plotly.newPlot(this.getElement(),ll.data,this.layout,settings);
        }
        else {
            //
            this.plotly=Plotly.newPlot(this.getElement(),ll.data,this.layout,settings);

        }

    }


    create() {
        this.applyObject(
            this.getDrawCommandObject()
        );

        return true;
    }
    getDarkThemeLayout() {

        if (!this.isDark()) return {};
        // https://github.com/plotly/dash-technical-charting/blob/master/quantmod/theming/themes.py
        // https://github.com/plotly/dash-technical-charting/blob/master/quantmod/theming/palettes.py

        return {
           layout:{
               // autosize:true,
               font:{'color':'eee','family':'Menlo'},
               plot_bgcolor:'#333',
               paper_bgcolor:'#333',
               legend:{bgcolor:'#333'},
           },
           colors:{
               increasing:'#00FF00',
               decreasing:'#FF9900',
               border_increasing:'rgba(255, 255, 255, 0.05)',
               border_decreasing:'rgba(255, 255, 255, 0.05)',
               primary :'#11AAEE',
               secondary : '#0084FF',
               tertiary : '#FC0D1B',
               quaternary : '#00FF00',
               grey:'rgba(255, 255, 255, 0.25)',
               grey_light:'rgba(255, 255, 255, 0.15)',
               grey_strong:'rgba(255, 255, 255, 0.40)',
               fill:'rgba(255, 255, 255, 0.10)',
               fill_light:'rgba(255, 255, 255, 0.05)',
               fill_strong:'rgba(255, 255, 255, 0.15)'
           },

           additions:{
                xaxis:{
                    color:'#333',
                    tickfont:'#CCC',
                    //                 rangeslider = dict(
                    //                     bordercolor = '#444444',
                    //                     bgcolor = '#444444',
                    //                     thickness = 0.1,
                    //                 ),
                    //                 rangeselector = dict(
                    //                     bordercolor = '#444444',
                    //                     bgcolor = '#444444',
                    //                     activecolor = '#666666',
                    //                 ),
                }
           },
       };// o






        // select number as nu,
        // sin(number) as s,
        // cos(number) as c
        // from system.numbers limit 40
        // DRAW_PLOTLY {
        //     trace:{x:data.nu,y:data.s,type:'scatter',name:'sin()'},
        //     trace1:{x:data.nu,y:data.c,type:'scatter',name:'cos()'},
        //     additions:{
        //         xaxis:{color:'#333'}
        //     },
        //     layout:{
        //         font:{'color':'eee','family':'Menlo'},
        //         plot_bgcolor:'#333',
        //             paper_bgcolor:'#333',
        //             legend:{bgcolor:'#333'}
        //
        //     }
        // }
    }
}
