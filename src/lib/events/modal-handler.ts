export class Modal {
    #dialog?: HTMLDialogElement;
    #isDragging = false;
    #rectDomElement?: DOMRect;
    #clickOrigin = {
        x: 0,
        y: 0,
    };
    #transformPosition = {
        x: 0,
        y: 0,
    }
  
    handleStartDrag = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const header = target.closest('header');

        if (header) {
            this.#dialog = header.closest('dialog') as HTMLDialogElement;
            this.#initDragModal(e);
        }
    };

    handleStopDrag = (e: Event) => {
        this.#isDragging = false;
        this.#initPosition();
        document.removeEventListener('pointermove', this.#handleDragDialog);
    };

    handleOptions = (e: Event) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button[part="cancel"]');

        if (button) {
            const dialog = button.closest('dialog');
            if (dialog) {
                dialog.close();
            }
        }
    };

    #initDragModal = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const button = target.closest('button');

        if(button) {
            return;
        }

        this.#isDragging = true;
        this.#clickOrigin.x = e.clientX;
        this.#clickOrigin.y = e.clientY;

        if(this.#dialog) {
            this.#rectDomElement = this.#dialog.getBoundingClientRect();
            this.#initPosition();
            document.addEventListener('pointermove', this.#handleDragDialog);
            e.preventDefault();
        }
    };

    #handleDragDialog = (e: MouseEvent) => {
        if (this.#isDragging && this.#rectDomElement && this.#dialog) {
            // Make sure that the modal cannot go beyond the top browser window
            const minY = this.#transformPosition.y - this.#rectDomElement.top;

            const cssX = this.#transformPosition.x+(this.#clickOrigin.x - e.clientX)*-1;
            const cssY = Math.max(this.#transformPosition.y+(this.#clickOrigin.y - e.clientY)*-1, minY);

            this.#dialog.style.transform = `translate3D(
                ${cssX}px, 
                ${cssY}px, 
                0
              )`;
        }
    };

    #initPosition = () => {
        if(this.#dialog) {
            const style = window.getComputedStyle(this.#dialog);
            const matrix = new DOMMatrixReadOnly(style.transform);
            this.#transformPosition.x = matrix.m41;
            this.#transformPosition.y = matrix.m42;
        }
    };
}