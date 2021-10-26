import React from "react"
import { Modal, Button} from "native-base"

const ModalComponent:React.FC<{
    open:boolean;
    handleToggle:() => void;
    title:string;
    actions?:any[]
}> = ({
    handleToggle,open,
    children,title,
    actions
}) => {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [size, setSize] = React.useState("md")

  
  return (
      <Modal isOpen={open} onClose={handleToggle} size={size}>
        <Modal.Content>
          <Modal.CloseButton />
          {title && 
            <Modal.Header>{title}</Modal.Header>
          }
          <Modal.Body>
              {children}
          </Modal.Body>
          {
            actions?.length && 
            <Modal.Footer>
                <Button.Group variant="outline" space={2}>
                {
                    actions.map((item,idx) => (
                        <Button key={idx} >{item}</Button>
                    ))
                }
                </Button.Group>
            </Modal.Footer>
          }
        </Modal.Content>
      </Modal>
  )
}

export default ModalComponent