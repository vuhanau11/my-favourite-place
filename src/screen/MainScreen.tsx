import React, { useState, useRef, SyntheticEvent } from 'react'
import { Media, Spinner } from 'reactstrap'
import classnames from 'classnames'
import { useQuery, useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import ReactMapGL, { Marker, ViewportProps } from 'react-map-gl'

import { GET_ALL_PLACES } from '../schema/queries/getPlaces'
import { GET_DETAIL_PLACE } from '../schema/queries/getPlaceDetail'
import { CREATE_PLACE, CreatePlaceResponse } from '../schema/mutations/createPlace'
import { IFilterPlace, TYPE_LOCATION } from '../models/place'
import http from '../utils/httpCommon'
import AddPopup from '../components/AddPopup'
import styles from '../../styles/screens/mainScreen.module.scss'

export const MainScreen = () => {
  const mapRef = useRef()
  const [addPoint, setAddPoint] = useState<any>(null)
  const [placeId, setPlaceId] = useState<number>(null)
  const [placeIndex, setPlaceIndex] = useState<number>(null)
  const [openPopup, setOpenPopup] = useState<boolean>(false)
  const [addPointStatus, setAddPointStatus] = useState<boolean>(false)
  const { data, loading, refetch } = useQuery<{ getAllPlaces: IFilterPlace[] }>(
    GET_ALL_PLACES,
    {
      variables: {
        input: {
          name: '',
          page: 1,
          pageSize: 100,
        },
      },
      fetchPolicy: 'no-cache',
    }
  )
  const heightScreen = document.getElementsByTagName('body')[0].clientHeight

  const { data: dataDetail } = useQuery<{
    getDetailPlace: IFilterPlace
  }>(GET_DETAIL_PLACE, {
    variables: {
      id: placeId,
    },
    fetchPolicy: 'no-cache',
  })
  const [createPlace] = useMutation<CreatePlaceResponse>(CREATE_PLACE)
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 105.83252961325773,
    latitude: 21.040755658976465,
    zoom: 6,
  })

  const user = {
    name: localStorage.getItem('USER'),
    avatar: localStorage.getItem('AVATAR')
  }

  if (loading) {
    return (
      <div className="text-center">
        <Spinner type="grow" color="primary" />
      </div>
    )
  }

  const addNewPlace = () => {
    setAddPointStatus(!addPointStatus)
  }

  const handleSubmitForm = async (
    event: SyntheticEvent<EventTarget>,
    point: any
  ) => {
    event.preventDefault()
    const longitude = point?.lngLat[0]
    const latitude = point?.lngLat[1]
    const location = await http.get(
      `/${longitude},${latitude}.json?access_token=${process.env.MAP_BOX_ACCESS_TOKEN}`
    )
    if (location?.status === 200 && location?.data) {
      const place = location?.data?.features[TYPE_LOCATION.PLACE]?.place_name || ''
      try {
        await createPlace({
          variables: {
            input: {
              name: `${place}`,
              longitude,
              latitude,
              userId: 1,
              status: 1,
            },
          },
        })
        setOpenPopup(false)
        refetch()
      } catch (_) {
      }
    }
  }

  return (
    <div
      className={classnames(
        styles.defaultPointer,
        styles.dFlex,
        styles.justifySpaceBetween
      )}
    >
      <div className={classnames(styles.cardContainer, styles.cardWidth14)}>
        <div className={classnames(styles.cardBody, styles.dFlex, styles.mt1)}>
          <div className={styles.dFlex}>
            <img src={user.avatar} className={styles.avaBorder} alt="ava" height="70" width="70" />
            <div className={classnames(styles.textName, styles.ml1, styles.dFlex, styles.alignCenter)}>{user.name}</div>
          </div>
        </div>
        <hr />
        <div>
          <div className={classnames(styles.ml1, styles.dFlex, styles.cursorPointer)} onClick={addNewPlace}>
            {addPointStatus === false ? (
              <img
                className={styles.imgLogout}
                src="/icons/menu.svg"
                alt="icon"
                height="22"
                width="22"
              />
            ) : (
              <img
                className={styles.imgLogout}
                src="/icons/activeMenu.svg"
                alt="icon"
                height="22"
                width="22"
              />
            )}
            <div className={addPointStatus === false ? null : styles.activeColor}>Thêm địa điểm mới</div>
          </div>
          <hr />
          <div className={classnames(styles.ml1, styles.dFlex, styles.cursorPointer)}>
            <img
              className={styles.imgLogout}
              src="/icons/menu.svg"
              alt="icon"
              height="22"
              width="22"
            />
            <div>Địa điểm ưa thích của tôi</div>
          </div>
          <hr />
          <div className={classnames(styles.ml1, styles.dFlex, styles.cursorPointer)}
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}>
            <img
              className={styles.imgLogout}
              src="/icons/logout.svg"
              alt="Exit here"
              height="24"
              width="24"
            />
            <div className={classnames(styles.dFlex, styles.alignCenter)}>Đăng xuất</div>
          </div>
        </div>
      </div>
      <ReactMapGL
        width='100vw'
        height='100vh'
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.MAP_BOX_ACCESS_TOKEN}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onNativeClick={(pointer) => {
          if (addPointStatus === true) {
            setAddPoint(pointer)
            setOpenPopup(true)
            setPlaceId(null)
          }
        }}
        ref={mapRef}
      >
        {openPopup &&
          <AddPopup
            point={addPoint}
            viewport={viewport}
            setOpenPopup={setOpenPopup}
            handleSubmitForm={handleSubmitForm}
          />}
        {data?.getAllPlaces?.map((item, index) => {
          return (
            <Marker
              key={index}
              longitude={Number(item.longitude)}
              latitude={Number(item.latitude)}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div>
                <span
                  onClick={() => {
                    setPlaceId(Number(item.id))
                    setPlaceIndex(index)
                  }}
                >
                  <Media
                    className={styles.imgLocation}
                    src="/icons/place.svg"
                    alt="Location here"
                  />
                </span>
                {placeIndex === index && placeId && (
                  <div
                    className={classnames(
                      styles.cardContainer,
                      styles.cursorPointer
                    )}
                  >
                    <Media
                      className={styles.imgPlace}
                      width="300px"
                      src={item.image}
                      alt="Image place"
                    />
                    <div className={styles.cardBody}>
                      <div>{item?.name}</div>
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
          <div className={styles.coordinates}>
            <div className={styles.coordinatesText}>
              {viewport.longitude} | {viewport.latitude}
            </div>
          </div>
        </div>
      </ReactMapGL>
      {placeId ? (
        <div className={classnames(styles.cardContainer, styles.cardWidth)} style={{ height: `${heightScreen}px` }}>
          <div>
            <Media
              width="100%"
              src={dataDetail?.getDetailPlace?.image}
              alt="Image place"
            />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.textName}>{dataDetail?.getDetailPlace?.name || ''}</div>
            <div className={styles.descriptionDetail}>
              {`${dataDetail?.getDetailPlace?.description || ''}`}
            </div>
          </div>
        </div>
      ) : (
        <div className={classnames(styles.cardContainer, styles.cardWidth, styles.overFlow_Y)}>
          <div className={styles.listPlaces}>Danh sách địa điểm</div>
          <div className={styles.solidBottom}></div>
          {data?.getAllPlaces?.map((item, index) => {
            return (
              <div
                className={classnames(styles.itemPlaces, styles.cardItemPlaces)}
                key={index}
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
                  <div className={styles.textName}>{item.name}</div>
                  <div className={styles.description}>{dayjs(item?.createdAt).format('DD-MM-YYYY')}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
