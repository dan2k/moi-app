import { reactive } from "vue";
import { region,region1 } from "./region.js";
export const lineData = reactive({
     series: [],
     chartOptions: {
          chart: {
               height: 350,
               type: "line",
               dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2,
               },
               zoom: {
                    type: "y",
                    enabled: true,
                    autoScaleXaxis: true,
               },
               toolbar: {
                    show: true,
               },
          },
          colors: ["#c96862", "#17c28c", "#847ff3"],
          dataLabels: {
               enabled: true,
          },
          stroke: {
               curve: "smooth",
          },
          title: {
               text: "ปริมาณการรับแจ้งปัญหา แยกรายปี",
               align: "left",
               margin: 10,
               offsetX: 0,
               offsetY: 0,
               floating: false,
               style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontFamily: undefined,
                    color: "#1ae8a0",
               },
          },
          grid: {
               borderColor: "#e7e7e7",
               row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
               },
          },
          markers: {
               size: 1,
          },
          xaxis: {
               categories: region,
               title: {
                    text: "ภาค",
               },
          },
          yaxis: {
               title: {
                    text: "ปริมาณ",
               },
               labels: {
                    formatter: function (val) {
                         // alert(val);
                         return (val / 1).toFixed(0);
                    },
               },
               min: 0,
               max: 3000,
          },
          legend: {
               position: "top",
               horizontalAlign: "right",
               floating: true,
               offsetY: -25,
               offsetX: -5,
          },
     },
});
export const genLine = (year, data) => {
     lineData.series.length=0;
     year.value.forEach((it, i) => {
          let data3 = [];
          region1.forEach((it2, i2) => {
               data3.push(
                    data.value
                         .filter(
                              (it3, i3) =>
                                   it3.yearTH == it && it3.region == it2
                         )
                         .reduce((r, c) => Number(r) + 1, 0)
               );
          });
          lineData.series.push({ name: it, data: data3 });
     });
};