//------------------------------------------------------------------
//
// Creates basic portal model, used to show where aliens pop out.
//
//------------------------------------------------------------------
Galaga.objects.ufo.Portal = function (spec) {

    let api = {
        get size() { return spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation },
    };

    return api;
};
