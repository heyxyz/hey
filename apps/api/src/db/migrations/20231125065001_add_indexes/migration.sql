-- CreateIndex
CREATE INDEX "Feature_key_priority_idx" ON "Feature"("key", "priority");

-- CreateIndex
CREATE INDEX "Group_slug_featured_idx" ON "Group"("slug", "featured");

-- CreateIndex
CREATE INDEX "Pro_hash_idx" ON "Pro"("hash");

-- CreateIndex
CREATE INDEX "ProfileFeature_profileId_featureId_idx" ON "ProfileFeature"("profileId", "featureId");

-- CreateIndex
CREATE INDEX "StaffPick_type_score_idx" ON "StaffPick"("type", "score");
