//------------------------------------------------------------------
//
// Creates basic portal model, used to show where aliens pop out.
//
//------------------------------------------------------------------
Galaga.objects.hazards.Portal = function (spec) {

    let api = {
        get size() { return spec.size; },
        get center() { return spec.center; },
    };

    return api;
};
