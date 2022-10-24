class WebglFacade {
    static NewInstance(context) {
        return new WebglFacade(context);
    }

    constructor(context) {
        this.context = context;
    }
}
