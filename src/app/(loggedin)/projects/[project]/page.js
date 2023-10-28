"use client";

import api from "@/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";

export default function Page({ params }) {
  const [project, setProject] = useState(null);

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
    </main>
  );
}
