import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Box,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import { pinFileToIPFS } from "../app/util/ipfs";

interface FormInputs {
  stake: string;
  file: FileList;
}

interface NewStratModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<NewStratModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    if (!data.file.length) {
      return alert("Please select a file to upload");
    }

    try {
      setLoading(true);

      //put stake

      //upload python
      pinFileToIPFS(data.file[0]).then((data) =>
        toast({
          title: "File upload successful",
          description: `IPFS hash: ${data.IpfsHash}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload your model and stake</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <FormControl
                  isInvalid={errors.file && errors.file.message !== ""}
                >
                  <FormLabel>Python file</FormLabel>
                  <Input
                    type="file"
                    {...register("file", {
                      required: "This field is required",
                    })}
                    variant={"unstyled"}
                  />
                </FormControl>
              </Box>
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={loading}
              >
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadModal;
