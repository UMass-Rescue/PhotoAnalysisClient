import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveBar } from "@nivo/bar";

/* ResponsiveBar takes the datasets and creates a bar graph based on the settings.
  keys: choose value to be associated as keys for each bar. Here we choose count
  indexBy: index the bars by each label
  valueScale: Scale for y-axis
  indexScale: scale for x-axis. band creates evenly spaced segments for categorical data
  colors: chooses the colors for bars. Categories can be mapped to color schemes. 
  axisBottom: define different settings for the axisBottom. 
  axisLeft: define differnt settings for the axisLeft. 
*/
const Graphs = () =>{
    const data = [{label: "isGreen", count: 17}, 
                 {label: "isRed", count: 24}];
    const styles = {
                    fontFamily: "sans-serif",
                    textAlign: "center",
                    fontSize: "16px",
                    padding: '30px'
                  };

    return(
        <div style={styles}>
        <h1>Model Results</h1>
        <div style={{ height: "840px" }}> 
          <ResponsiveBar data={data} 
                         keys={["count"]}
                         indexBy="label"
                         valueScale={{ type: 'linear' }}
                         indexScale={{ type: 'band', round: true }} 
                         colors={"#5AC6AC"}
                         margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                         padding={0.3}
                         axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Counts',
                          legendPosition: 'middle',
                          legendOffset: 32
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 1,
                          tickRotation: 0,
                          legend: 'Classes',
                          legendPosition: 'middle',
                          legendOffset: -50
                        }}
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                      theme={{
                        axis: {
                          ticks: {
                            text: {
                              fontSize: "14px"
                            }
                          },
                          legend: {
                              text: {
                                  fontSize: "14px"
                              }
                          }
                        }
                      }}
          />
        </div>
      </div>
    );
};

export default Graphs;