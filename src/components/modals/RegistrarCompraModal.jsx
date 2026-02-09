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
import { FacturaModal } from "@/components/modals/FacturaModal";

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
  const [clienteBloqueado, setClienteBloqueado] = useState(false);

  const [modalAbiertoCliente, setModalAbiertoCliente] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [modoModalCliente, setModoModalCliente] = useState("crear");

  const [loading, setLoading] = useState(true);

  const [mostrarFactura, setMostrarFactura] = useState(false);
  const [compraIdFactura, setCompraIdFactura] = useState(null);

  const montoTotal = seleccionados.reduce((acc, p) => acc + p.monto, 0);

  function calcularMonto(producto, cuotas) {
    let unitario;

    switch (cuotas) {
      case 1:
        unitario = producto.precio_contado;
        break;
      case 2:
        unitario = producto.precio_contado;
        break;
      case 3:
        unitario = producto.tres_cuotas;
        break;
      case 6:
        unitario = producto.seis_cuotas;
        break;
      case 9:
        unitario = producto.nueve_cuotas;
        break;
      case 12:
        unitario = producto.doce_cuotas;
        break;
      default:
        unitario = producto.precio_contado;
    }

    return unitario;
  }

  useEffect(() => {
    if (searchEmpleado.length < 3) {
      setEmpleados([]);
      return;
    }

    buscarEmpleados(searchEmpleado).then(({ data }) =>
      setEmpleados(data ?? []),
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
    if (clienteBloqueado) return;

    if (searchCliente.length < 3) {
      setClientes([]);
      return;
    }

    buscarClientes(searchCliente).then(({ data }) => setClientes(data ?? []));
  }, [searchCliente, clienteBloqueado]);

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
    setSeleccionados((prev) => {
      const existente = prev.find((p) => p.id === producto.id);

      if (existente) {
        if (existente.cantidad >= producto.stock) {
          toast.error("No hay más stock disponible");
          return prev;
        }

        return prev.map((p) =>
          p.id === producto.id
            ? {
                ...p,
                cantidad: p.cantidad + 1,
                monto: calcularMonto(p, p.cuotas) * (p.cantidad + 1),
              }
            : p,
        );
      }

      if (producto.stock <= 0) {
        toast.error("Producto sin stock");
        return prev;
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
          tipo_pago: "contado",
          medio_contado: "efectivo",
          alias: null,
          cuotas: 1,
          monto_unitario: producto.precio_contado,
          monto: producto.precio_contado,
          estado_pago: "completado",
        },
      ];
    });
  }

  function removerProducto(index) {
    setSeleccionados((prev) => prev.filter((_, i) => i !== index));
  }

  function actualizarCuotas(index, cuotas, producto) {
    const copia = [...seleccionados];
    const unitario = calcularMonto(producto, cuotas);

    copia[index].cuotas = cuotas;
    copia[index].monto_unitario = unitario;
    copia[index].monto = unitario * copia[index].cantidad;

    setSeleccionados(copia);
  }

  async function guardarCompra() {
    if (!fecha || seleccionados.length === 0) {
      return toast.error("Faltan datos obligatorios");
    }
    for (const p of seleccionados) {
      if (p.tipo_pago === "contado") {
        if (!p.medio_contado) {
          return toast.error(
            `Elegí el medio de pago para el producto "${p.nombre}"`,
          );
        }

        if (
          p.medio_contado === "transferencia" &&
          (!p.alias || p.alias.trim() === "")
        ) {
          return toast.error(
            `Ingresá el alias de la transferencia para "${p.nombre}"`,
          );
        }
      }
    }

    setLoading(false);

    const { ok, message, compraId } = await registrarCompra(
      fecha,
      empleadoSeleccionado?.id,
      montoTotal,
      seleccionados,
      clienteSeleccionado?.id ?? null,
    );

    setLoading(true);

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);

    // 🔥 ABRIR FACTURA
    setCompraIdFactura(compraId);
    setMostrarFactura(true);
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
                onChange={(e) => {
                  setSearchCliente(e.target.value);
                  setClienteBloqueado(false);
                }}
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
                  <span className="text-sm">{c.nombre_completo}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setClienteSeleccionado(c);
                      setSearchCliente(c.nombre_completo);
                      setClientes([]);
                      setClienteBloqueado(true);
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setSeleccionados((prev) =>
                            prev.map((x, idx) =>
                              idx === i && x.cantidad > 1
                                ? {
                                    ...x,
                                    cantidad: x.cantidad - 1,
                                    monto: x.monto_unitario * (x.cantidad - 1),
                                  }
                                : x,
                            ),
                          )
                        }
                      >
                        −
                      </Button>

                      <span className="text-sm">{p.cantidad}</span>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setSeleccionados((prev) =>
                            prev.map((x, idx) =>
                              idx === i && x.cantidad < p.stock
                                ? {
                                    ...x,
                                    cantidad: x.cantidad + 1,
                                    monto: x.monto_unitario * (x.cantidad + 1),
                                  }
                                : x,
                            ),
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select
                      value={p.tipo_pago}
                      onValueChange={(v) => {
                        const copia = [...seleccionados];
                        const cuotas = v === "cuotas" ? 2 : 1;

                        const unitario = calcularMonto(p, cuotas);

                        copia[i].tipo_pago = v;
                        copia[i].estado_pago =
                          v === "contado" ? "completado" : "pendiente";
                        copia[i].cuotas = cuotas;
                        copia[i].monto_unitario = unitario;
                        copia[i].monto = unitario * copia[i].cantidad;

                        setSeleccionados(copia);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contado">Contado</SelectItem>

                        <SelectItem value="cuotas">Cuotas</SelectItem>
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
                          {[2, 3, 6, 9, 12]
                            .filter((c) => c === 2 || c <= p.cantidad_cuotas)
                            .map((c) => (
                              <SelectItem key={c} value={String(c)}>
                                {c} cuotas
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}

                    {
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Medio de pago
                        </label>

                        <Select
                          value={p.medio_contado}
                          onValueChange={(v) => {
                            const copia = [...seleccionados];
                            copia[i].medio_contado = v;
                            copia[i].alias = v === "transferencia" ? "" : null;
                            setSeleccionados(copia);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="transferencia">
                              Transferencia
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {p.medio_contado === "transferencia" && (
                          <Input
                            placeholder="Alias / CVU"
                            value={p.alias ?? ""}
                            onChange={(e) => {
                              const copia = [...seleccionados];
                              copia[i].alias = e.target.value;
                              setSeleccionados(copia);
                            }}
                          />
                        )}
                      </div>
                    }
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
      <FacturaModal
        open={mostrarFactura}
        compraId={compraIdFactura}
        onClose={() => {
          setMostrarFactura(false);
          onClose(); // recién acá cerrás todo
        }}
      />
    </Dialog>
  );
}
