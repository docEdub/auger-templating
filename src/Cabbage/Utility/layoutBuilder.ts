import { Form } from "../Types/form";
import { Group, GroupLayout } from "../Types/group";
import { Widget } from "../Types/widget";

export class LayoutBuilder {
    public build(form: Form) {
        this.buildGroup(form);
    }

    private buildGroup(group: Group) {
        switch (group.layout) {
            case GroupLayout.LeftToRight:
                this.buildGroupLeftToRight(group);
                break;
            case GroupLayout.TopToBottom:
                this.buildGroupTopToBottom(group);
                break;
            }
    }

    private buildGroupLeftToRight(group: Group) {
        let top = 0;
        let left = 0;
        let nextTop = 0;
        for (let i = 0; i < group.children?.length; i++) {
            const child = group.children[i];
            child.top = top;
            child.left = left;
            left = child.right;
            nextTop = Math.max(nextTop, top + child.bottom);
            if (group.width <= left) {
                top = nextTop;
                left = 0;
            }
        }
    }

    private buildGroupTopToBottom(group: Group) {
        let top = 0;
        let left = 0;
        let nextLeft = 0;
        for (let i = 0; i < group.children?.length; i++) {
            const child = group.children[i];
            child.top = top;
            child.left = left;
            top = child.bottom;
            nextLeft = Math.max(nextLeft, left + child.right);
            if (group.height <= top) {
                top = 0;
                left = nextLeft;
            }
        }
    }
}

if (global.testing) {
    global.LayoutBuilder = LayoutBuilder;
}
