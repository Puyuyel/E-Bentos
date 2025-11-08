"use client";
import {
  Column,
  Grid,
  Form,
  TextInput,
  Stack,
  Select,
  SelectItem,
  FormItem,
  FileUploaderDropContainer,
  FormGroup,
  FileUploaderItem,
} from "@carbon/react";
import { useRef, useState, useEffect } from "react";
import BottomButtons from "../../../components/Gestion/BottomButtons";

interface Lookup {
  value: string;
  label: string;
}

export default function OwnerCRUD() {
  //const fileUploaderRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ marginTop: "20px", marginRight: "20px", marginLeft: "20px" }}>
      <Form>
        <Stack gap={8}>
          <VenueForm></VenueForm>
          <OwnerForm></OwnerForm>
          <BottomButtons
            gap={7}
            buttons={[
              { text: "Cancelar", kind: "secondary" },
              {
                text: "Aplicar",
                kind: "primary",
                onClick: () => console.log("Aplicado"),
              },
            ]}
          />
        </Stack>
      </Form>
    </div>
  );
}

function VenueForm() {
  //const [tiposLocales, setTiposLocales] = useState<Lookup[]>([]);
  const [distritos, setDistritos] = useState<Lookup[]>([]);
  const [provincias, setProvincias] = useState<Lookup[]>([]);
  const [departamentos, setDepartamentos] = useState<Lookup[]>([]);
  const tiposLocales = [
    { value: "discoteca", label: "Discoteca" },
    { value: "bar", label: "Bar" },
    { value: "restaurante", label: "Restaurante" },
    { value: "cafe", label: "Café" },
  ]; /*
  const distritos = [
    { value: 'publo_libre', label: 'Publo Libre' },
    { value: 'miraflores', label: 'Miraflores' },
    { value: 'ventanilla', label: 'Ventanilla' },
    { value: 'san_miguel', label: 'San Miguel' }
  ];
  const provincias = [
    { value: 'chachapoyas', label: 'Chachapoyas' },
    { value: 'bagua', label: 'Bagua' },
    { value: 'huaraz', label: 'Huaraz' },
    { value: 'abancay', label: 'Abancay' }
  ];
  const departamentos = [
    { value: 'amazonas', label: 'Amazonas' },
    { value: 'ancash', label: 'Áncash' },
    { value: 'apurimac', label: 'Apurímac' },
    { value: 'arequipa', label: 'Arequipa' }
  ];*/
  const fileUploaderRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  /*
  useEffect((): void => {
    fetch('/api/tipos-local')
      .then((res: Response): Promise<Lookup[]> => res.json())
      .then((data: Lookup[]): void => setTiposLocales(data))
      .catch((err: Error): void => console.error('Error al cargar los tipos de locales', err));
  }, []);*/
  useEffect((): void => {
    fetch("/api/distritos")
      .then((res: Response): Promise<Lookup[]> => res.json())
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.distritoId.toString(),
          label: item.nombre,
        }));
        setDistritos(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar los distritos", err)
      );
  }, []);
  useEffect((): void => {
    fetch("/api/provincias")
      .then((res: Response): Promise<Lookup[]> => res.json())
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.provinciaId.toString(),
          label: item.nombre,
        }));
        setProvincias(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar las provincias", err)
      );
  }, []);
  useEffect((): void => {
    fetch("/api/departamentos")
      .then((res: Response): Promise<Lookup[]> => res.json())
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.departamentoId.toString(),
          label: item.nombre,
        }));
        setDepartamentos(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar los departamentos", err)
      );
  }, []);

  return (
    <FormGroup legendText="Datos del local">
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            <TextInput
              className="input-test-class"
              id="nombre_local"
              invalidText=""
              labelText="Nombre del local"
              placeholder="Ingrese el nombre del local"
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <Grid>
              <Column sm={2} md={2} lg={6} xlg={6} max={6}>
                <Select
                  id="tipo_local"
                  labelText="Tipo del local"
                  size="md"
                  style={{ width: "100%" }}
                  defaultValue=""
                >
                  <SelectItem
                    text="Seleccione el Tipo de Local"
                    value=""
                    disabled
                  />
                  {tiposLocales.map((tipo: Lookup) => (
                    <SelectItem
                      key={tipo.value}
                      text={tipo.label}
                      value={tipo.value}
                    />
                  ))}
                </Select>
              </Column>
              <Column sm={2} md={2} lg={2} xlg={2} max={2}>
                <TextInput
                  className="input-test-class"
                  id="aforo"
                  invalidText=""
                  labelText="Aforo"
                  placeholder="Ingrese el aforo"
                  size="md"
                  type="number"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
            <TextInput
              className="input-test-class"
              id="direccion_local"
              invalidText=""
              labelText="Dirección del local"
              placeholder="Ingrese la dirección del local"
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <Stack orientation="horizontal" gap={4}>
              <Select
                id="distrito"
                labelText="Distrito"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem text="Seleccione el Distrito" value="" disabled />
                {distritos.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
              <Select
                id="provincia"
                labelText="Provincia"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem text="Seleccione la Provincia" value="" disabled />
                {provincias.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
              <Select
                id="departamento"
                labelText="Departamento"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem
                  text="Seleccione el Departamento"
                  value=""
                  disabled
                />
                {departamentos.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
            </Stack>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <FormItem>
            <p className="cds--file--label">Upload files</p>
            <p className="cds--label-description">
              Max file size is 500 KB. Supported file types are .jpg and .png.
            </p>
            <FileUploaderDropContainer
              accept={["image/jpeg", "image/png"]}
              innerRef={fileUploaderRef}
              labelText="Drag and drop files here or click to upload"
              multiple
              name=""
              onAddFiles={(event, { addedFiles }) => {
                setFiles((prev) => [...prev, ...addedFiles]);
              }}
              onChange={() => {}}
              tabIndex={0}
            />
            {files.map((file, index) => (
              <FileUploaderItem
                key={index}
                name={file.name}
                status="edit"
                size="md"
                onDelete={() => {
                  setFiles(files.filter((_, i) => i !== index));
                }}
              />
            ))}
            <div className="cds--file-container cds--file-container--drop" />
          </FormItem>
        </Column>
      </Grid>
    </FormGroup>
  );
}

function OwnerForm() {
  //const [tipoDocumento, setTiposDocumentos] = useState<Lookup[]>([]);
  const tipoDocumento = [
    { value: "dni", label: "DNI (Documento Nacional de Identidad)" },
    { value: "ce", label: "Carné de Extranjería" },
    { value: "pasaporte", label: "Pasaporte" },
    { value: "ptp", label: "Permiso Temporal de Permanencia (PTP)" },
  ];
  /*
  useEffect((): void => {
    fetch('/api/tipos-documentos')
      .then((res: Response): Promise<Lookup[]> => res.json())
      .then((data: Lookup[]): void => setTiposDocumentos(data))
      .catch((err: Error): void => console.error('Error al cargar los tipos de documentos', err));
  }, []);
  */
  return (
    <FormGroup legendText="Datos de propietarios y responsables">
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            <Grid>
              <Column sm={2} md={2} lg={2} xlg={2} max={2}>
                <Select
                  id="tipo_doc_propietario"
                  labelText="Tipo de Documento"
                  size="md"
                  style={{ width: "100%" }}
                  defaultValue=""
                >
                  <SelectItem
                    text="Seleccione el Tipo de Documento"
                    value=""
                    disabled
                  />
                  {tipoDocumento.map((tipo: Lookup) => (
                    <SelectItem
                      key={tipo.value}
                      text={tipo.label}
                      value={tipo.value}
                    />
                  ))}
                </Select>
              </Column>
              <Column sm={2} md={2} lg={6} xlg={6} max={6}>
                <TextInput
                  className="input-test-class"
                  id="numero_propietario"
                  invalidText=""
                  labelText="Número de Identificación del Propietario"
                  placeholder="Ingrese el número de Identificación del Propietario"
                  size="md"
                  type="text"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
            <Grid>
              <Column sm={2} md={2} lg={2} xlg={2} max={2}>
                <Select
                  id="tipo_doc_responsable"
                  labelText="Tipo de Documento"
                  size="md"
                  style={{ width: "100%" }}
                  defaultValue=""
                >
                  <SelectItem
                    text="Seleccione el Tipo de Documento"
                    value=""
                    disabled
                  />
                  {tipoDocumento.map((tipo: Lookup) => (
                    <SelectItem
                      key={tipo.value}
                      text={tipo.label}
                      value={tipo.value}
                    />
                  ))}
                </Select>
              </Column>
              <Column sm={2} md={2} lg={6} xlg={6} max={6}>
                <TextInput
                  className="input-test-class"
                  id="numero_responsable"
                  invalidText=""
                  labelText="Número de Identificación del Responsable"
                  placeholder="Ingrese el número de Identificación del Responsable"
                  size="md"
                  type="text"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
            <Grid>
              <Column sm={2} md={2} lg={4} xlg={4} max={4}>
                <TextInput
                  className="input-test-class"
                  id="telefono_contacto_1"
                  invalidText=""
                  labelText="Teléfono de Contacto 1"
                  placeholder="Ingrese el número de Contacto"
                  size="md"
                  type="text"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
              <Column sm={2} md={2} lg={4} xlg={4} max={4}>
                <TextInput
                  className="input-test-class"
                  id="telefono_contacto_2"
                  invalidText=""
                  labelText="Teléfono de Contacto 2 (opcional)"
                  placeholder="Ingrese el número de Contacto"
                  size="md"
                  type="text"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            <TextInput
              className="input-test-class"
              id="nombre_propietario"
              invalidText=""
              labelText="Nombre del Propietario"
              placeholder="Ingrese el Nombre del Propietario"
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <TextInput
              className="input-test-class"
              id="nombre_responsable"
              invalidText=""
              labelText="Nombre del Responsable"
              placeholder="Ingrese el Nombre del Responsable"
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <TextInput
              className="input-test-class"
              id="Correo de contacto"
              invalidText=""
              labelText="Correo de Contacto"
              placeholder="Ingrese el Correo de Contacto"
              size="md"
              type="email"
              warnText=""
              style={{ width: "100%" }}
            />
          </Stack>
        </Column>
      </Grid>
    </FormGroup>
  );
}
