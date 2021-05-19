import React from 'react'
import { Button, Form } from 'reactstrap'
import { Popup } from 'react-map-gl'
import styles from '../../styles/screens/mainScreen.module.scss'

const AddPopup = ({ point, viewport, setOpenPopup, handleSubmitForm }) => {
  return (
    <Popup
      latitude={point?.lngLat[1] || viewport.latitude}
      longitude={point?.lngLat[0] || viewport.longitude}
      onClose={() => setOpenPopup(false)}
      closeButton={true}
      closeOnClick={false}
      offsetTop={-30}
    >
      <Form className={styles.mt1}>
        <Button color="primary" onClick={(e) => handleSubmitForm(e, point)}>
          {'Add'}
        </Button>
      </Form>
    </Popup>
  )
}

export default AddPopup
