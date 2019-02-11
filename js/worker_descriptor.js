function worker_descriptor(screen_descriptors, pattern_descriptors){
	var q_cnt = screen_descriptors.rows;
    var query_du8 = screen_descriptors.data;
    var query_u32 = screen_descriptors.buffer.i32; // cast to integer buffer
    var qd_off = 0;
    var qidx=0,lev=0,pidx=0,k=0;
    var num_matches = 0;

    for(qidx = 0; qidx < q_cnt; ++qidx) {
        var best_dist = 256;
        var best_dist2 = 256;
        var best_idx = -1;
        var best_lev = -1;

        for(lev = 0; lev < num_train_levels; ++lev) {
            var lev_descr = pattern_descriptors[lev];
            var ld_cnt = lev_descr.rows;
            var ld_i32 = lev_descr.buffer.i32; // cast to integer buffer
            var ld_off = 0;

            for(pidx = 0; pidx < ld_cnt; ++pidx) {

                var curr_d = 0;
                // our descriptor is 32 bytes so we have 8 Integers
                for(k=0; k < 8; ++k) {
                    curr_d += popcnt32( query_u32[qd_off+k]^ld_i32[ld_off+k] );
                }

                if(curr_d < best_dist) {
                    best_dist2 = best_dist;
                    best_dist = curr_d;
                    best_lev = lev;
                    best_idx = pidx;
                } else if(curr_d < best_dist2) {
                    best_dist2 = curr_d;
                }

                ld_off += 8; // next descriptor
            }
        }

        //filter using the ratio between 2 closest matches
        if(best_dist < 0.8*best_dist2) {
            matches[num_matches].screen_idx = qidx;
            matches[num_matches].pattern_lev = best_lev;
            matches[num_matches].pattern_idx = best_idx;
            num_matches++;
        }
        
        qd_off += 8; // next query descriptor
    }

    return num_matches;
}

self.onmessage = function(e){
	data = e.data;

	var matching = worker_descriptor(data.screen_descriptors, data.pattern_descriptors);
}