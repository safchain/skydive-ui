import Vue from "vue";

declare var d3: any;

export default Vue.extend({
    template: `
        <g>
            <path style="marker-start: url(#markerSquare); marker-end: url(#markerSquare);" :d="pathData"/>
        </g>
    `,
    props: ['x1', 'y1', 'x2', 'y2'],

    data() {
        return {
            lineGenerator: d3.line().curve(d3.curveBasis),
        }
    },

    mounted: function() {
    },

    computed: {
        pathData: function() {
            var points = [[this.x1, this.y1]];
        
            // 4 for now but could be a parameter of link.
            var dx = Math.abs(Math.floor((this.x2 - this.x1) / 4));
            var dy = Math.abs(Math.floor((this.y2 - this.y1) / 4));
        
            points.push([this.x1 + dx, this.y1 + dy]);
            points.push([this.x2 - dx, this.y2 - dy]);
        
            points.push([this.x2, this.y2]);

            return this.lineGenerator(points);
        }
    },

    methods: {
    }
});
