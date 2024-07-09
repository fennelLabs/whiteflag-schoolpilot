import { Affix, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import WhiteFlagContext from "../../helpers/Context";
import { SetLocationModal } from "../LocationModal/SetLocationModal";

export interface Location {
  latitude?: number;
  longitude?: number;
}
interface Props {
  // onSetLocation: (location:any) => void
}
const CoordinatesHeader: React.FC<Props> = (props) => {
  const ctx = useContext(WhiteFlagContext);
  const [locationModalVisable, setLocationModalVisable] =
    useState<boolean>(false);

  useEffect(() => {
    if (ctx.location.latitude === 0 && ctx.location.longitude === 0) {
      setLocationModalVisable(true);
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      ctx.locationHandler({ latitude, longitude });
      ctx.mapNavigationHandler(undefined, undefined);
    });
  };
  const locationMarker = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
    >
      <path
        d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z"
        fill="white"
      />
    </svg>
  );

  return (
    <React.Fragment>
      {ctx.location.latitude !== 0 && ctx.location.longitude !== 0 && (
        <React.Fragment>
          <Affix offsetTop={0} style={{ marginTop: "-20px" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "#090A0B",
                height: "56px",
                overflow: "initial",
                top: "24px",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ padding: "20px" }}>{locationMarker}</div>
                <div>
                  <Row>
                    <Typography.Text
                      type={"secondary"}
                      style={{
                        color: "#FFFFFF",
                        marginTop: "4px",
                        marginBottom: "0px",
                      }}
                    >
                      Your reference location
                    </Typography.Text>
                  </Row>
                  <Row>
                    <Typography.Text>
                      {`${ctx.location.latitude.toFixed(6)},
                        ${ctx.location.longitude.toFixed(6)}`}
                    </Typography.Text>
                  </Row>
                </div>
              </div>
              <div
                style={{
                  float: "right",
                  marginRight: "16px",
                  marginLeft: "auto",
                  marginTop: "15px",
                }}
              >
                <Typography.Link
                  strong
                  underline
                  onClick={() => setLocationModalVisable(true)}
                >
                  Edit
                </Typography.Link>
              </div>
            </div>
          </Affix>
        </React.Fragment>
      )}
      <SetLocationModal
        location={ctx.location}
        setLocation={ctx.locationHandler}
        setCurrentLocation={() => getLocation()}
        open={locationModalVisable}
        setOpen={setLocationModalVisable}
      />
    </React.Fragment>
  );
};
export default CoordinatesHeader;
