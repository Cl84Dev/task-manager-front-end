"use client";

import api from "@/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";

import ModalAddTask from "./components/ModalAddTask";
import Task from "./components/Task";
import ModalEditTask from "./components/ModalEditTask";

export default function Page({ params }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [modalRole, setModalRole] = useState("addTask");
  const [modalData, setModalData] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const openModal = (role, data) => {
    if (role === "editTask") {
      setModalData(data);
    }
    setModalRole(role);
    onOpen();
  };

  useEffect(() => {
    api
      .get(`project/${params.project}`)
      .then((res) => setProject(res.data))
      .catch((err) => {
        toast.error(err.response.data.error);
        setTimeout(() => {
          location.replace("/projects");
        }, 3000);
      });

    api
      .get(`tasks/${params.project}`)
      .then((res) => setTasks(res.data))
      .catch((err) => {
        toast.error(err.response.data.error);
        setTimeout(() => {
          location.replace("/projects");
        }, 3000);
      });
  }, []);

  if (!project) {
    return (
      <main className="m-3 flex flex-col justify-center items-center">
        <Spinner size="lg" className="my-5" />
      </main>
    );
  }

  return (
    <main className="m-3 flex flex-col justify-center items-center">
      <h1 className="my-3 text-3xl font-bold text-blue-600">
        {project && project.title}
      </h1>
      <Button
        color="primary"
        variant="solid"
        type="submit"
        className="font-bold mb-3"
        onClick={() => openModal("addTask")}
      >
        Adicionar tarefa
      </Button>

      {tasks && tasks.length === 0 && (
        <div className="my-3">
          Nada por aqui... Comece adicionando uma tarefa.
        </div>
      )}

      {tasks ? (
        tasks.map((item) => (
          <Task
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            status={item.status}
            priority={item.priority}
            date={item.date}
            openModal={() =>
              openModal("editTask", {
                id: item._id,
                title: item.title,
                description: item.description,
                status: item.status,
                priority: item.priority,
              })
            }
          />
        ))
      ) : (
        <Spinner size="lg" className="my-5" />
      )}

      {modalRole === "addTask" ? (
        <ModalAddTask
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          projectId={project._id}
        />
      ) : (
        <ModalEditTask
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          taskId={modalData.id}
          title={modalData.title}
          description={modalData.description}
          status={modalData.status}
          priority={modalData.priority}
        />
      )}
    </main>
  );
}
