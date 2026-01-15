import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getProductos } from "@/supabase/productos";
import { registrarCompra } from "@/supabase/compras";
import { buscarEmpleados } from "@/supabase/empleados";
import { buscarClientes, createCliente } from "@/supabase/clientes";
import { toast } from "sonner";
import { ClientModal } from "./ClientModal";

export function RegistrarCompraModal({ open, onClose }) {
  //, empleados }) {
  const [fecha, setFecha] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  const [searchEmpleado, setSearchEmpleado] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [searchCliente, setSearchCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [modalAbiertoCliente, setModalAbiertoCliente] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [modoModalCliente, setModoModalCliente] = useState("crear");

  const [loading, setLoading] = useState(true);
  const montoTotal = seleccionados.reduce((acc, p) => acc + p.monto, 0);

  function calcularMonto(producto, cuotas) {
    console.log(producto, cuotas);
    switch (cuotas) {
      case 1:
        return producto.precio_contado;
      case 3:
        return producto.tres_cuotas;
      case 6:
        return producto.seis_cuotas;
      case 9:
        return producto.nueve_cuotas;
      case 12:
        return producto.doce_cuotas;
      default:
        return producto.precio_contado;
    }
  }

  useEffect(() => {
    if (searchEmpleado.length < 3) {
      setEmpleados([]);
      return;
    }

    buscarEmpleados(searchEmpleado).then(({ data }) =>
      setEmpleados(data ?? [])
    );
  }, [searchEmpleado]);
  useEffect(() => {
    if (!open) return;

    setFecha("");
    setSearch("");
    setProductos([]);
    setSeleccionados([]);

    setSearchEmpleado("");
    setEmpleados([]);
    setEmpleadoSeleccionado(null);

    setSearchCliente("");
    setClientes([]);
    setClienteSeleccionado(null);
  }, [open]);

  useEffect(() => {
    if (searchCliente.length < 3) {
      setClientes([]);
      return;
    }

    buscarClientes(searchCliente).then(({ data }) => setClientes(data ?? []));
  }, [searchCliente]);

  useEffect(() => {
    if (search.trim().length < 3) {
      setProductos([]);
      return;
    }

    cargarProductos();
  }, [search]);

  async function cargarProductos() {
    const { data } = await getProductos(search, 1, 10);
    setProductos(data ?? []);
  }

  async function handleGuardarCliente(formData) {
    try {
      const { error } = await createCliente(formData);
      setModalAbiertoCliente(false);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  function agregarProducto(producto) {
    if (producto.stock <= 0) return alert("Producto sin stock");

    setSeleccionados((prev) => [
      ...prev,
      {
        ...producto,
        tipo_pago: "contado",
        cuotas: 1,
        monto: producto.precio_contado,
        estado_pago: "completado",
      },
    ]);
  }
  function removerProducto(index) {
    setSeleccionados((prev) => prev.filter((_, i) => i !== index));
  }

  function actualizarCuotas(index, cuotas, producto) {
    const copia = [...seleccionados];
    copia[index].monto = calcularMonto(producto, cuotas);
    copia[index].cuotas = cuotas;
    setSeleccionados(copia);
  }

  async function guardarCompra() {
    // if (!fecha || !empleadoId || seleccionados.length === 0) {
    if (!fecha || seleccionados.length === 0) {
      return toast.error("Faltan datos obligatorios");
    }

    setLoading(false);

    const { ok, message } = await registrarCompra(
      fecha,
      empleadoSeleccionado?.id,
      montoTotal,
      seleccionados,
      clienteSeleccionado?.id ?? null
    );
    console.log(ok, message);
    !ok ? toast.error(message) : toast.success(message);

    setLoading(true);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg">Registrar compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Fecha */}
          <div>
            <label className="text-sm font-medium">Fecha</label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente</label>

            <div className="flex gap-2">
              <Input
                placeholder="Buscar cliente..."
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
              />

              <Button
                size="icon"
                variant="outline"
                onClick={() => setModalAbiertoCliente(true)}
                title="Registrar cliente"
              >
                +
              </Button>
            </div>

            <div className="space-y-2">
              {clientes.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center border rounded-lg p-2"
                >
                  <span className="text-sm">
                    {c.nombre} {c.apellido}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setClienteSeleccionado(c);
                      setClientes([]);
                      setSearchCliente(`${c.nombre} ${c.apellido}`);
                    }}
                  >
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Empleado */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Empleado</label>
            <Input
              placeholder="Buscar empleado..."
              value={searchEmpleado}
              onChange={(e) => setSearchEmpleado(e.target.value)}
            />

            <div className="space-y-2">
              {empleados.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center border rounded-lg p-2"
                >
                  <span className="text-sm">
                    {e.nombre} {e.apellido}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEmpleadoSeleccionado(e);
                      setEmpleados([]);
                      setSearchEmpleado(`${e.nombre} ${e.apellido}`);
                    }}
                  >
                    Seleccionar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Productos</label>
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search.length > 0 && search.length < 3 && (
              <p className="text-xs text-muted-foreground">
                Escribí al menos 3 letras
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productos.map((p) => {
                const sinStock = p.stock === 0;

                return (
                  <div
                    key={p.id}
                    className={`border rounded-xl p-3 flex flex-col justify-between gap-2
                  ${sinStock ? "opacity-50" : ""}`}
                  >
                    <div>
                      <p className="font-medium text-sm">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {p.stock}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      disabled={sinStock}
                      variant={sinStock ? "secondary" : "default"}
                      onClick={() => agregarProducto(p)}
                    >
                      {sinStock ? "Sin stock" : "Agregar"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seleccionados */}
          <div className="space-y-3 pt-4 border-t">
            <label className="text-sm font-medium">
              Productos seleccionados
            </label>

            <div className="space-y-3">
              {seleccionados.map((p, i) => (
                <div key={i} className="border rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge>{p.nombre}</Badge>

                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">${p.monto}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => removerProducto(i)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select
                      value={p.tipo_pago}
                      onValueChange={(v) => {
                        const copia = [...seleccionados];
                        const cuotas =
                          v === "cuotas" && p.cantidad_cuotas > 0
                            ? p.cantidad_cuotas
                            : 1;

                        copia[i].tipo_pago = v;
                        copia[i].estado_pago =
                          v === "contado" ? "completado" : "pendiente";
                        copia[i].cuotas = cuotas;
                        copia[i].monto = calcularMonto(p, cuotas);

                        setSeleccionados(copia);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contado">Contado</SelectItem>

                        {p.cantidad_cuotas > 0 && (
                          <SelectItem value="cuotas">Cuotas</SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {p.tipo_pago === "cuotas" && (
                      <Select
                        value={String(p.cuotas)}
                        onValueChange={(v) => actualizarCuotas(i, Number(v), p)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 6, 9, 12]
                            .filter((c) => c <= p.cantidad_cuotas)
                            .map((c) => (
                              <SelectItem key={c} value={String(c)}>
                                {c} cuotas
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between font-semibold text-lg pt-4 border-t">
            <span>Total</span>
            <span>${montoTotal}</span>
          </div>

          <Button className="w-full" onClick={guardarCompra}>
            {loading == true ? "Guardar compra" : "Cargando compra..."}
          </Button>
        </div>
      </DialogContent>
      <ClientModal
        abierto={modalAbiertoCliente}
        onCerrar={() => setModalAbiertoCliente(false)}
        cliente={cliente}
        modo={modoModalCliente}
        onGuardar={handleGuardarCliente}
      />
    </Dialog>
  );
}
