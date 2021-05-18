import React, { useState } from 'react'
import { Media, Spinner } from 'reactstrap'
import classnames from 'classnames'
import { useQuery } from '@apollo/client'
import { GET_ALL_PLACES } from '../schema/queries/getPlaces'
import { GET_DETAIL_PLACE } from '../schema/queries/getPlaceDetail'
import ReactMapGL, { Marker, SourceProps } from 'react-map-gl'
import { IFilterPlace } from '../models/place'
import styles from '../../styles/screens/mainScreen.module.scss'

export const MainScreen = () => {
  const [addPoint, setAddPoint] = useState<SourceProps>(null)
  const [isCreatePoint, setIsCreatePoint] = useState<boolean>(false)
  const [placeIndex, setPlaceIndex] = useState<number>(null)
  const [placeId, setPlaceId] = useState<number>(null)
  const { data, loading } = useQuery<{ getAllPlaces: IFilterPlace[] }>(
    GET_ALL_PLACES,
    {
      variables: {
        input: {
          name: '',
          page: 1,
          pageSize: 10,
        },
      },
      fetchPolicy: 'no-cache',
    }
  )

  const { data: dataDetail, loading: loadingDetail } = useQuery<{
    getDetailPlace: IFilterPlace
  }>(GET_DETAIL_PLACE, {
    variables: {
      id: placeId,
    },
    fetchPolicy: 'no-cache',
  })

  const [viewport, setViewport] = useState({
    width: '80vw',
    height: '100vh',
    longitude: 105.83252961325773,
    latitude: 21.040755658976465,
    zoom: 6,
  })

  if (loading) {
    return (
      <div className="text-center">
        <Spinner type="grow" color="primary" />
      </div>
    )
  }

  return (
    <div
      className={classnames(
        styles.defaultPointer,
        styles.dFlex,
        styles.justifySpaceBetween
      )}
    >
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.MAP_BOX_ACCESS_TOKEN}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onNativeClick={(pointer) => {
          setAddPoint(pointer)
          setIsCreatePoint(true)
        }}
      >
        {data?.getAllPlaces?.map((item, index) => {
          return (
            <Marker
              key={index}
              longitude={Number(item.longitude)}
              latitude={Number(item.latitude)}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div
                onDoubleClick={() => {
                  setPlaceIndex(null)
                  setPlaceId(null)
                }}
              >
                <span
                  onClick={() => {
                    setPlaceIndex(index)
                    setPlaceId(Number(item.id))
                  }}
                >
                  <Media
                    className={styles.imgLocation}
                    src="/icons/place.svg"
                    alt="Location here"
                  />
                </span>
                {placeIndex === index && (
                  <div
                    className={classnames(
                      styles.cardContainer,
                      styles.cursorPointer
                    )}
                    onClick={() => {
                      setPlaceIndex(index)
                      setPlaceId(Number(item.id))
                    }}
                  >
                    <Media
                      className={styles.imgPlace}
                      width="300px"
                      src="https://dulichkhampha24.com/wp-content/uploads/2019/09/kinh-nghiem-du-lich-Ha-Noi-1.jpg"
                      alt="Image place"
                    />
                    <div className={styles.cardBody}>
                      <div>{item.name}</div>
                      <div className={styles.description}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Marker>
          )
        }) ?? []}
        <div className={classnames(styles.dFlex, styles.justifySpaceBetween)}>
          <span
            onClick={() => {
              localStorage.setItem('APP_TOKEN', '')
              window.location.reload()
            }}
          >
            <Media
              className={styles.imgLogout}
              src="/icons/logout.svg"
              alt="Exit here"
              title={'Logout'}
            />
          </span>
          <div className={styles.coordinates}>
            <div className={styles.coordinatesText}>
              {viewport.longitude} | {viewport.latitude}
            </div>
          </div>
        </div>
      </ReactMapGL>
      {placeId ? (
        <div className={classnames(styles.cardContainer, styles.cardWidth)}>
          <div className={styles.listPlaces}>Danh sách địa điểm</div>
          <div className={styles.solidBottom}></div>
          <div
            className={classnames(styles.itemPlaces, styles.cardItemPlaces)}
            onMouseMove={() => setPlaceIndex(placeIndex)}
            onMouseLeave={() => setPlaceIndex(null)}
          >
            <div>
              <Media
                className={styles.imgPlace}
                width="100%"
                src="https://lh5.googleusercontent.com/p/AF1QipM9KO9ZvLbwTU_THLKT8ON0itJg9rhj6X6cdWMT=w262-h104-p-k-no"
                alt="Image place"
              />
            </div>
            <div className={styles.cardBody}>
              <div>{dataDetail?.getDetailPlace?.name}</div>
              <div className={styles.description}>
                {dataDetail?.getDetailPlace?.description}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={classnames(styles.cardContainer, styles.cardWidth)}>
          <div className={styles.listPlaces}>Danh sách địa điểm</div>
          <div className={styles.solidBottom}></div>
          {data?.getAllPlaces?.map((item, index) => {
            return (
              <div
                className={classnames(styles.itemPlaces, styles.cardItemPlaces)}
                key={index}
                onMouseMove={() => setPlaceIndex(index)}
                onMouseLeave={() => setPlaceIndex(null)}
              >
                <div>
                  <Media
                    className={styles.imgPlace}
                    width="100%"
                    src={item.image}
                    alt="Image place"
                  />
                </div>
                <div className={styles.cardBody}>
                  <div>{item.name}</div>
                  <div className={styles.description}>{item.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
