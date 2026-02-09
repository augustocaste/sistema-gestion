import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ConfirmDeleteModal({
  abierto,
  onCerrar,
  titulo,
  mensaje,
  onConfirmar,
}) {
  async function handleGuardarClick() {
    try {
      const result = await onConfirmar();

      if (!result?.ok) {
        toast.error("Ocurrió un error al eliminar el empleado");
        return;
      }

      toast.success("Empleado eliminado correctamente");

      onCerrar();
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al eliminar el empleado");
    }
  }
  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo || "Confirmar eliminación"}</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground">
          {mensaje || "¿Estás seguro de realizar esta acción?"}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleGuardarClick}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
