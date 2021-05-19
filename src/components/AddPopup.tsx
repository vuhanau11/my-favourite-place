import React from 'react'
import { Button, Form, FormGroup } from 'reactstrap'
import { Popup } from 'react-map-gl'
import styles from '../../styles/screens/mainScreen.module.scss'

const AddPopup = ({ point, viewport, setClosePopup, handleSubmitForm }) => {
  return (
    <Popup
      latitude={point?.lngLat[1] || viewport.latitude}
      longitude={point?.lngLat[0] || viewport.longitude}
      onClose={() => setClosePopup(false)}
      closeButton={true}
      closeOnClick={false}
      offsetTop={-30}
    >
      <Form className={styles.mt1}>
        <FormGroup className={styles.mt1}>
          <Button color="success" onClick={(e) => handleSubmitForm(e, point)}>
            {'Add'}
          </Button>
        </FormGroup>
      </Form>
    </Popup>
  )
}

export default AddPopup
